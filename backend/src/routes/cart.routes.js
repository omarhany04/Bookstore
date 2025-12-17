const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cart.controller");

router.use(auth);

router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:isbn", updateItem);
router.delete("/items/:isbn", removeItem);
router.delete("/", clearCart);

module.exports = router;
