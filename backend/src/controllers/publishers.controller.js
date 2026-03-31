const db = require("../db");

exports.listPublishers = async (req, res, next) => {
  try {
    const r = await db.query(
      `SELECT publisher_id, name
       FROM publishers
       ORDER BY name ASC`
    );

    res.json(r.rows);
  } catch (err) {
    next(err);
  }
};
