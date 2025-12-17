const router = require("express").Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const {
  addBook,
  updateBook,
  updateStock,
  listReplenishments,
  confirmReplenishment
} = require("../controllers/admin.controller");

router.use(auth);
router.use(requireRole("ADMIN"));

router.post("/books", addBook);
router.patch("/books/:isbn", updateBook);
router.patch("/books/:isbn/stock", updateStock);

router.get("/replenishment-orders", listReplenishments);
router.patch("/replenishment-orders/:id/confirm", confirmReplenishment);

module.exports = router;
