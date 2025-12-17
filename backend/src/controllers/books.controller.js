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
  if (q.category) {
    clauses.push(`b.category = $${i++}`);
    params.push(q.category);
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

    const sql = `
      SELECT
        b.isbn,
        b.title,
        b.publication_year,
        b.selling_price,
        b.category,
        b.stock_qty,
        b.threshold,
        p.name AS publisher,
        COALESCE(
          json_agg(DISTINCT a.full_name) FILTER (WHERE a.author_id IS NOT NULL),
          '[]'
        ) AS authors
      FROM books b
      JOIN publishers p ON p.publisher_id = b.publisher_id
      LEFT JOIN book_authors ba ON ba.isbn = b.isbn
      LEFT JOIN authors a ON a.author_id = ba.author_id
      ${where}
      GROUP BY b.isbn, p.name
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
        b.category,
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
      LEFT JOIN book_authors ba ON ba.isbn = b.isbn
      LEFT JOIN authors a ON a.author_id = ba.author_id
      WHERE b.isbn = $1
      GROUP BY b.isbn, p.publisher_id, p.name, p.address, p.phone;
    `;
    const r = await db.query(sql, [isbn]);
    if (!r.rowCount) return res.status(404).json({ message: "Book not found" });
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};
