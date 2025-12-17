const db = require("../db");

exports.previousMonthSales = async (req, res, next) => {
  try {
    const r = await db.query(
      `SELECT COALESCE(SUM(amount),0) AS total_sales
       FROM sales_transactions
       WHERE sale_date >= date_trunc('month', CURRENT_DATE) - interval '1 month'
         AND sale_date <  date_trunc('month', CURRENT_DATE)`
    );
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.salesByDay = async (req, res, next) => {
  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Missing date=YYYY-MM-DD" });

    const r = await db.query(
      `SELECT COALESCE(SUM(amount),0) AS total_sales
       FROM sales_transactions
       WHERE sale_date::date = $1::date`,
      [date]
    );
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.topCustomers = async (req, res, next) => {
  try {
    const months = Number(req.query.months || 3);
    const limit = Number(req.query.limit || 5);

    const r = await db.query(
      `SELECT u.user_id, u.username, COALESCE(SUM(st.amount),0) AS total_spent
       FROM sales_transactions st
       JOIN customer_orders o ON o.order_id = st.order_id
       JOIN users u ON u.user_id = o.user_id
       WHERE st.sale_date >= NOW() - ($1 || ' months')::interval
       GROUP BY u.user_id, u.username
       ORDER BY total_spent DESC
       LIMIT $2`,
      [months, limit]
    );

    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};

exports.topBooks = async (req, res, next) => {
  try {
    const months = Number(req.query.months || 3);
    const limit = Number(req.query.limit || 10);

    const r = await db.query(
      `SELECT i.isbn, i.book_name_snapshot, SUM(i.qty) AS total_sold
       FROM customer_order_items i
       JOIN customer_orders o ON o.order_id = i.order_id
       WHERE o.order_date >= NOW() - ($1 || ' months')::interval
         AND o.status = 'Confirmed'
       GROUP BY i.isbn, i.book_name_snapshot
       ORDER BY total_sold DESC
       LIMIT $2`,
      [months, limit]
    );

    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};

exports.bookReplenishmentCount = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const r = await db.query(
      `SELECT COUNT(*)::int AS times_ordered
       FROM replenishment_orders
       WHERE isbn=$1`,
      [isbn]
    );
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};
