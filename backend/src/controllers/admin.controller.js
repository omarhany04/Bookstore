const db = require("../db");
const { z } = require("zod");

exports.addBook = async (req, res, next) => {
  try {
    const schema = z.object({
      isbn: z.string().min(3),
      title: z.string().min(1),
      publication_year: z.number().int().min(1500).max(2100),
      selling_price: z.number().nonnegative(),
      category: z.enum(["Science","Art","Religion","History","Geography"]),
      publisher_id: z.number().int().positive(),
      stock_qty: z.number().int().nonnegative(),
      threshold: z.number().int().nonnegative(),
      authors: z.array(z.string().min(1)).default([]) // full names
    });
    const data = schema.parse(req.body);

    await db.query(
      `INSERT INTO books(isbn,title,publication_year,selling_price,category,publisher_id,stock_qty,threshold)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [data.isbn, data.title, data.publication_year, data.selling_price, data.category, data.publisher_id, data.stock_qty, data.threshold]
    );

    for (const name of data.authors) {
      const a = await db.query(
        `INSERT INTO authors(full_name) VALUES ($1)
         ON CONFLICT (full_name) DO UPDATE SET full_name=EXCLUDED.full_name
         RETURNING author_id`,
        [name]
      );
      const author_id = a.rows[0].author_id;

      await db.query(
        `INSERT INTO book_authors(isbn, author_id) VALUES ($1,$2)
         ON CONFLICT DO NOTHING`,
        [data.isbn, author_id]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const schema = z.object({
      title: z.string().min(1).optional(),
      publication_year: z.number().int().min(1500).max(2100).optional(),
      selling_price: z.number().nonnegative().optional(),
      category: z.enum(["Science","Art","Religion","History","Geography"]).optional(),
      publisher_id: z.number().int().positive().optional(),
      threshold: z.number().int().nonnegative().optional()
    });
    const data = schema.parse(req.body);

    const r = await db.query(
      `UPDATE books SET
        title = COALESCE($1, title),
        publication_year = COALESCE($2, publication_year),
        selling_price = COALESCE($3, selling_price),
        category = COALESCE($4, category),
        publisher_id = COALESCE($5, publisher_id),
        threshold = COALESCE($6, threshold)
      WHERE isbn = $7
      RETURNING isbn`,
      [
        data.title || null,
        data.publication_year ?? null,
        data.selling_price ?? null,
        data.category || null,
        data.publisher_id ?? null,
        data.threshold ?? null,
        isbn
      ]
    );

    if (!r.rowCount) return res.status(404).json({ message: "Book not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const schema = z.object({ stock_qty: z.number().int() });
    const data = schema.parse(req.body);

    // Trigger will block negative
    const r = await db.query("UPDATE books SET stock_qty=$1 WHERE isbn=$2 RETURNING isbn, stock_qty", [data.stock_qty, isbn]);
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
    if (!r.rowCount) return res.status(404).json({ message: "Order not found or already confirmed" });

    // Trigger adds stock automatically
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
