const db = require("../db");

exports.listCategories = async (req, res, next) => {
  try {
    const r = await db.query(
      `SELECT category_id, name
       FROM categories
       ORDER BY name ASC`
    );
    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};
