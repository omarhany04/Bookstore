const db = require("../db");
const { z } = require("zod");

const optionalCoverImageUrlSchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}, z.string().url().nullable().optional());

function buildOpenLibraryCoverUrl(isbn) {
  const normalizedIsbn = String(isbn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  if (!normalizedIsbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${normalizedIsbn}-L.jpg?default=false`;
}

function normalizeAuthorNames(authors = []) {
  return [...new Set(authors.map((name) => String(name).trim()).filter(Boolean))];
}

async function ensureAuthor(client, name) {
  const existingAuthor = await client.query(
    "SELECT author_id FROM authors WHERE LOWER(full_name) = LOWER($1) LIMIT 1",
    [name]
  );

  if (existingAuthor.rowCount) {
    return existingAuthor.rows[0].author_id;
  }

  const insertedAuthor = await client.query(
    `INSERT INTO authors(full_name)
     VALUES ($1)
     RETURNING author_id`,
    [name]
  );

  return insertedAuthor.rows[0].author_id;
}

async function syncBookAuthors(client, isbn, authors = []) {
  const normalizedAuthors = normalizeAuthorNames(authors);

  await client.query("DELETE FROM book_authors WHERE isbn = $1", [isbn]);

  for (const name of normalizedAuthors) {
    const author_id = await ensureAuthor(client, name);
    await client.query(
      `INSERT INTO book_authors(isbn, author_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [isbn, author_id]
    );
  }
}

exports.addBook = async (req, res, next) => {
  const client = await db.pool.connect();
  let transactionStarted = false;

  try {
    const schema = z.object({
      isbn: z.string().min(3),
      title: z.string().min(1),
      publication_year: z.number().int().min(1500).max(2100),
      selling_price: z.number().nonnegative(),
      category_id: z.number().int().positive(), 
      publisher_id: z.number().int().positive(),
      stock_qty: z.number().int().nonnegative(),
      threshold: z.number().int().nonnegative(),
      cover_image_url: optionalCoverImageUrlSchema,
      authors: z.array(z.string().min(1)).default([]),
    });

    const data = schema.parse(req.body);
    const coverImageUrl = data.cover_image_url ?? buildOpenLibraryCoverUrl(data.isbn);

    await client.query("BEGIN");
    transactionStarted = true;

    await client.query(
      `INSERT INTO books(
         isbn,
         title,
         cover_image_url,
         publication_year,
         selling_price,
         category_id,
         publisher_id,
         stock_qty,
         threshold
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        data.isbn,
        data.title,
        coverImageUrl,
        data.publication_year,
        data.selling_price,
        data.category_id,
        data.publisher_id,
        data.stock_qty,
        data.threshold,
      ]
    );

    await syncBookAuthors(client, data.isbn, data.authors);
    await client.query("COMMIT");

    res.json({ ok: true });
  } catch (err) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
    next(err);
  } finally {
    client.release();
  }
};

exports.updateBook = async (req, res, next) => {
  const client = await db.pool.connect();
  let transactionStarted = false;

  try {
    const isbn = req.params.isbn;
    const hasCoverImageUrl = Object.prototype.hasOwnProperty.call(req.body, "cover_image_url");
    const hasAuthors = Object.prototype.hasOwnProperty.call(req.body, "authors");

    const schema = z.object({
      title: z.string().min(1).optional(),
      publication_year: z.number().int().min(1500).max(2100).optional(),
      selling_price: z.number().nonnegative().optional(),
      category_id: z.number().int().positive().optional(), 
      publisher_id: z.number().int().positive().optional(),
      threshold: z.number().int().nonnegative().optional(),
      stock_qty: z.number().int().nonnegative().optional(), 
      cover_image_url: optionalCoverImageUrlSchema,
      authors: z.array(z.string().min(1)).optional(),
    });

    const data = schema.parse(req.body);
    await client.query("BEGIN");
    transactionStarted = true;

    const r = await client.query(
      `UPDATE books SET
        title = COALESCE($1, title),
        publication_year = COALESCE($2, publication_year),
        selling_price = COALESCE($3, selling_price),
        category_id = COALESCE($4, category_id),
        publisher_id = COALESCE($5, publisher_id),
        threshold = COALESCE($6, threshold),
        stock_qty = COALESCE($7, stock_qty),
        cover_image_url = CASE
          WHEN $8 THEN $9
          ELSE cover_image_url
        END
      WHERE isbn = $10
      RETURNING isbn`,
      [
        data.title || null,
        data.publication_year ?? null,
        data.selling_price ?? null,
        data.category_id ?? null,
        data.publisher_id ?? null,
        data.threshold ?? null,
        data.stock_qty ?? null,
        hasCoverImageUrl,
        data.cover_image_url ?? null,
        isbn,
      ]
    );

    if (!r.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Book not found" });
    }

    if (hasAuthors) {
      await syncBookAuthors(client, isbn, data.authors || []);
    }

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
    next(err);
  } finally {
    client.release();
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const schema = z.object({ stock_qty: z.number().int() });
    const data = schema.parse(req.body);

    // Trigger will block negative
    const r = await db.query(
      "UPDATE books SET stock_qty=$1 WHERE isbn=$2 RETURNING isbn, stock_qty",
      [data.stock_qty, isbn]
    );
    if (!r.rowCount) return res.status(404).json({ message: "Book not found" });

    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.listReplenishments = async (req, res, next) => {
  try {
    const status = req.query.status;
    const params = [];
    let where = "";
    if (status) {
      params.push(status);
      where = "WHERE ro.status = $1";
    }

    const r = await db.query(
      `SELECT ro.repl_order_id, ro.isbn, b.title, p.name AS publisher, ro.qty, ro.status, ro.order_date
       FROM replenishment_orders ro
       JOIN books b ON b.isbn = ro.isbn
       JOIN publishers p ON p.publisher_id = ro.publisher_id
       ${where}
       ORDER BY ro.order_date DESC`,
      params
    );

    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};

exports.confirmReplenishment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const r = await db.query(
      `UPDATE replenishment_orders SET status='Confirmed'
       WHERE repl_order_id=$1 AND status <> 'Confirmed'
       RETURNING repl_order_id, status`,
      [id]
    );
    if (!r.rowCount)
      return res.status(404).json({ message: "Order not found or already confirmed" });

    // Trigger adds stock automatically
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
