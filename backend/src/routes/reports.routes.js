const router = require("express").Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const {
  previousMonthSales,
  salesByDay,
  topCustomers,
  topBooks,
  bookReplenishmentCount
} = require("../controllers/reports.controller");

router.use(auth);
router.use(requireRole("ADMIN"));

router.get("/sales/previous-month", previousMonthSales);
router.get("/sales/by-day", salesByDay);
router.get("/top-customers", topCustomers);
router.get("/top-books", topBooks);
router.get("/book-replenishments/:isbn/count", bookReplenishmentCount);

module.exports = router;
