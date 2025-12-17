const router = require("express").Router();
const auth = require("../middleware/auth");
const { checkout, myOrders } = require("../controllers/orders.controller");

router.use(auth);

router.post("/checkout", checkout);
router.get("/mine", myOrders);

module.exports = router;
