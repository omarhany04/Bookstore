const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const db = require("../db");

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  shipping_address: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await db.query("SELECT 1 FROM users WHERE username=$1 OR email=$2", [data.username, data.email]);
    if (existing.rowCount) return res.status(409).json({ message: "Username or email already exists" });

    const hash = await bcrypt.hash(data.password, 10);
    const result = await db.query(
      `INSERT INTO users(username,password_hash,first_name,last_name,email,phone,shipping_address,role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'CUSTOMER')
       RETURNING user_id, username, role`,
      [data.username, hash, data.first_name, data.last_name, data.email, data.phone || null, data.shipping_address || null]
    );

    const token = signToken(result.rows[0]);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await db.query(
      "SELECT user_id, username, password_hash, role, first_name, last_name, email, phone, shipping_address FROM users WHERE username=$1",
      [data.username]
    );
    if (!result.rowCount) return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const r = await db.query(
      "SELECT user_id, username, role, first_name, last_name, email, phone, shipping_address FROM users WHERE user_id=$1",
      [req.user.user_id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const schema = z.object({
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      shipping_address: z.string().optional(),
      password: z.string().min(6).optional(),
    });
    const data = schema.parse(req.body);

    let password_hash = null;
    if (data.password) password_hash = await bcrypt.hash(data.password, 10);

    const result = await db.query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name  = COALESCE($2, last_name),
        email      = COALESCE($3, email),
        phone      = COALESCE($4, phone),
        shipping_address = COALESCE($5, shipping_address),
        password_hash = COALESCE($6, password_hash)
      WHERE user_id=$7
      RETURNING user_id, username, role, first_name, last_name, email, phone, shipping_address`,
      [
        data.first_name || null,
        data.last_name || null,
        data.email || null,
        data.phone || null,
        data.shipping_address || null,
        password_hash,
        req.user.user_id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
