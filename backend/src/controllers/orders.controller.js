const db = require("../db");
const { z } = require("zod");
const { validateCard } = require("../utils/validateCard");

exports.checkout = async (req, res, next) => {
  const schema = z.object({
    cardNumber: z.string().min(12),
    expiryMMYY: z.string().min(4).max(4),
  });

  const client = await db.pool.connect();
  try {
    const data = schema.parse(req.body);
    const card = validateCard(data.cardNumber, data.expiryMMYY);
    if (!card.ok) return res.status(400).json({ message: `Payment failed: ${card.reason}` });

    await client.query("BEGIN");

    // Ensure active cart
    const cartRes = await client.query(
      "SELECT cart_id FROM carts WHERE user_id=$1 AND status='ACTIVE' ORDER BY cart_id DESC LIMIT 1",
      [req.user.user_id]
    );
    const cart_id = cartRes.rowCount ? cartRes.rows[0].cart_id : null;
    if (!cart_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    const itemsRes = await client.query(
      `SELECT ci.isbn, ci.qty, b.title, b.selling_price, b.stock_qty
       FROM cart_items ci
       JOIN books b ON b.isbn = ci.isbn
       WHERE ci.cart_id = $1
       FOR UPDATE OF b`,
      [cart_id]
    );

    if (!itemsRes.rowCount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock
    for (const it of itemsRes.rows) {
      if (it.stock_qty < it.qty) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Not enough stock for ${it.title}` });
      }
    }

    // Create order
    const orderRes = await client.query(
      `INSERT INTO customer_orders(user_id, status, payment_last4)
       VALUES ($1, 'Pending', $2)
       RETURNING order_id`,
      [req.user.user_id, card.last4]
    );
    const order_id = orderRes.rows[0].order_id;

    let total = 0;

    // Insert items + deduct stock
    for (const it of itemsRes.rows) {
      total += Number(it.selling_price) * it.qty;

      await client.query(
        `INSERT INTO customer_order_items(order_id,isbn,book_name_snapshot,unit_price_snapshot,qty)
         VALUES ($1,$2,$3,$4,$5)`,
        [order_id, it.isbn, it.title, it.selling_price, it.qty]
      );

      await client.query(
        `UPDATE books SET stock_qty = stock_qty - $1 WHERE isbn = $2`,
        [it.qty, it.isbn]
      );
    }

    await client.query(
      `UPDATE customer_orders SET total_price=$1, status='Confirmed' WHERE order_id=$2`,
      [total.toFixed(2), order_id]
    );

    await client.query(
      `INSERT INTO sales_transactions(order_id, amount) VALUES ($1,$2)`,
      [order_id, total.toFixed(2)]
    );

    // Clear cart items (logout also clears cart; but checkout should clear too)
    await client.query("DELETE FROM cart_items WHERE cart_id=$1", [cart_id]);

    await client.query("COMMIT");
    res.json({ ok: true, order_id });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await db.query(
      `SELECT order_id, order_date, total_price, payment_last4, status
       FROM customer_orders
       WHERE user_id=$1
       ORDER BY order_date DESC`,
      [req.user.user_id]
    );

    const ids = orders.rows.map(o => o.order_id);
    let itemsByOrder = {};
    if (ids.length) {
      const items = await db.query(
        `SELECT order_id, isbn, book_name_snapshot, unit_price_snapshot, qty
         FROM customer_order_items
         WHERE order_id = ANY($1::int[])
         ORDER BY book_name_snapshot`,
        [ids]
      );
      for (const it of items.rows) {
        if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
        itemsByOrder[it.order_id].push(it);
      }
    }

    res.json(orders.rows.map(o => ({ ...o, items: itemsByOrder[o.order_id] || [] })));
  } catch (err) {
    next(err);
  }
};
