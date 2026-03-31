const db = require("../db");

module.exports = function requireRole(role) {
  return async function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      // Read the current role from the database so promoted users are not blocked by stale tokens.
      const result = await db.query("SELECT role FROM users WHERE user_id = $1", [req.user.user_id]);
      const currentRole = result.rows[0]?.role;

      if (!currentRole) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user.role = currentRole;

      if (currentRole !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
