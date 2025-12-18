const db = require("../db");

function buildWhere(q) {
  const clauses = [];
  const params = [];
  let i = 1;

  if (q.isbn) {
    clauses.push(`b.isbn = $${i++}`);
    params.push(q.isbn);
  }
  if (q.title) {
    clauses.push(`b.title ILIKE $${i++}`);
    params.push(`%${q.title}%`);
  }

  if (q.category_id) {
    clauses.push(`b.category_id = $${i++}`);
    params.push(Number(q.category_id));
  }

  if (q.publisher) {
    clauses.push(`p.name ILIKE $${i++}`);
    params.push(`%${q.publisher}%`);
  }
  if (q.author) {
    clauses.push(`a.full_name ILIKE $${i++}`);
    params.push(`%${q.author}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { where, params };
}

exports.listBooks = async (req, res, next) => {
  try {
    const { where, params } = buildWhere(req.query);

    const wantsPaging =
      req.query.page !== undefined || req.query.pageSize !== undefined;

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSizeRaw = Number(req.query.pageSize || 4);
    const pageSize = Math.min(50, Math.max(1, pageSizeRaw));
    const offset = (page - 1) * pageSize;

    if (wantsPaging) {
      const countSql = `
        SELECT COUNT(DISTINCT b.isbn)::int AS total
        FROM books b
        JOIN publishers p ON p.publisher_id = b.publisher_id
        JOIN categories c ON c.category_id = b.category_id
        LEFT JOIN book_authors ba ON ba.isbn = b.isbn
        LEFT JOIN authors a ON a.author_id = ba.author_id
        ${where};
      `;
      const countRes = await db.query(countSql, params);
      const total = Number(countRes.rows[0]?.total || 0);

      const itemsSql = `
        SELECT
          b.isbn,
          b.title,
          b.publication_year,
          b.selling_price,
          b.category_id,
          c.name AS category,
          b.stock_qty,
          b.threshold,
          p.name AS publisher,
          COALESCE(
            json_agg(DISTINCT a.full_name) FILTER (WHERE a.author_id IS NOT NULL),
            '[]'
          ) AS authors
        FROM books b
        JOIN publishers p ON p.publisher_id = b.publisher_id
        JOIN categories c ON c.category_id = b.category_id
        LEFT JOIN book_authors ba ON ba.isbn = b.isbn
        LEFT JOIN authors a ON a.author_id = ba.author_id
        ${where}
        GROUP BY b.isbn, p.name, c.name
        ORDER BY b.title ASC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
      `;
      const itemsRes = await db.query(itemsSql, [...params, pageSize, offset]);

      return res.json({
        items: itemsRes.rows,
        total,
        page,
        pageSize,
      });
    }

    const sql = `
      SELECT
        b.isbn,
        b.title,
        b.publication_year,
        b.selling_price,
        b.category_id,
        c.name AS category,
        b.stock_qty,
        b.threshold,
        p.name AS publisher,
        COALESCE(
          json_agg(DISTINCT a.full_name) FILTER (WHERE a.author_id IS NOT NULL),
          '[]'
        ) AS authors
      FROM books b
      JOIN publishers p ON p.publisher_id = b.publisher_id
      JOIN categories c ON c.category_id = b.category_id
      LEFT JOIN book_authors ba ON ba.isbn = b.isbn
      LEFT JOIN authors a ON a.author_id = ba.author_id
      ${where}
      GROUP BY b.isbn, p.name, c.name
      ORDER BY b.title ASC;
    `;

    const r = await db.query(sql, params);
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const sql = `
      SELECT
        b.isbn,
        b.title,
        b.publication_year,
        b.selling_price,
        b.category_id,
        c.name AS category,
        b.stock_qty,
        b.threshold,
        p.publisher_id,
        p.name AS publisher,
        p.address AS publisher_address,
        p.phone AS publisher_phone,
        COALESCE(
          json_agg(DISTINCT a.full_name) FILTER (WHERE a.author_id IS NOT NULL),
          '[]'
        ) AS authors
      FROM books b
      JOIN publishers p ON p.publisher_id = b.publisher_id
      JOIN categories c ON c.category_id = b.category_id
      LEFT JOIN book_authors ba ON ba.isbn = b.isbn
      LEFT JOIN authors a ON a.author_id = ba.author_id
      WHERE b.isbn = $1
      GROUP BY b.isbn, p.publisher_id, p.name, p.address, p.phone, c.name;
    `;
    const r = await db.query(sql, [isbn]);
    if (!r.rowCount) return res.status(404).json({ message: "Book not found" });
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};
