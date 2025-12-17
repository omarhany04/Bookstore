const router = require("express").Router();
const auth = require("../middleware/auth");
const { checkout, myOrders, cancelMyOrder } = require("../controllers/orders.controller");

router.use(auth);

router.post("/checkout", checkout);
router.get("/mine", myOrders);
router.delete("/:id", cancelMyOrder);

module.exports = router;
