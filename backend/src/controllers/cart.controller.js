const db = require("../db");
const { z } = require("zod");

async function ensureActiveCart(user_id) {
  const r = await db.query(
    "SELECT cart_id FROM carts WHERE user_id=$1 AND status='ACTIVE' ORDER BY cart_id DESC LIMIT 1",
    [user_id]
  );
  if (r.rowCount) return r.rows[0].cart_id;

  const c = await db.query("INSERT INTO carts(user_id,status) VALUES ($1,'ACTIVE') RETURNING cart_id", [user_id]);
  return c.rows[0].cart_id;
}

async function getBookStock(isbn) {
  const r = await db.query("SELECT stock_qty, title FROM books WHERE isbn=$1", [isbn]);
  if (!r.rowCount) return null;
  return { stock_qty: Number(r.rows[0].stock_qty), title: r.rows[0].title };
}

async function getCurrentCartQty(cart_id, isbn) {
  const r = await db.query("SELECT qty FROM cart_items WHERE cart_id=$1 AND isbn=$2", [cart_id, isbn]);
  return r.rowCount ? Number(r.rows[0].qty) : 0;
}

exports.getCart = async (req, res, next) => {
  try {
    const cart_id = await ensureActiveCart(req.user.user_id);

    const items = await db.query(
      `SELECT ci.isbn, b.title, b.selling_price, b.stock_qty, ci.qty,
              (b.selling_price * ci.qty)::numeric(12,2) AS line_total
       FROM cart_items ci
       JOIN books b ON b.isbn = ci.isbn
       WHERE ci.cart_id = $1
       ORDER BY b.title`,
      [cart_id]
    );

    const total = items.rows.reduce((s, x) => s + Number(x.line_total), 0);

    res.json({ cart_id, items: items.rows, total: total.toFixed(2) });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const schema = z.object({ isbn: z.string().min(1), qty: z.number().int().positive() });
    const data = schema.parse(req.body);

    const cart_id = await ensureActiveCart(req.user.user_id);
    const book = await getBookStock(data.isbn);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const currentQty = await getCurrentCartQty(cart_id, data.isbn);
    const nextQty = currentQty + Number(data.qty);

    if (nextQty > book.stock_qty) {
      return res.status(400).json({
        message: `Only ${book.stock_qty} in stock for "${book.title}". You already have ${currentQty} in your cart.`,
      });
    }

    await db.query(
      `INSERT INTO cart_items(cart_id,isbn,qty)
       VALUES ($1,$2,$3)
       ON CONFLICT (cart_id,isbn) DO UPDATE SET qty = cart_items.qty + EXCLUDED.qty`,
      [cart_id, data.isbn, data.qty]
    );

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const schema = z.object({ qty: z.number().int().positive() });
    const data = schema.parse(req.body);
    const isbn = req.params.isbn;

    const cart_id = await ensureActiveCart(req.user.user_id);
    const book = await getBookStock(isbn);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const nextQty = Number(data.qty);
    if (nextQty > book.stock_qty) {
      return res.status(400).json({
        message: `Only ${book.stock_qty} in stock for "${book.title}".`,
      });
    }

    await db.query("UPDATE cart_items SET qty=$1 WHERE cart_id=$2 AND isbn=$3", [nextQty, cart_id, isbn]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const isbn = req.params.isbn;
    const cart_id = await ensureActiveCart(req.user.user_id);

    await db.query("DELETE FROM cart_items WHERE cart_id=$1 AND isbn=$2", [cart_id, isbn]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart_id = await ensureActiveCart(req.user.user_id);
    await db.query("DELETE FROM cart_items WHERE cart_id=$1", [cart_id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
