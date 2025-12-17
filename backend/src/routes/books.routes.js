const router = require("express").Router();
const { listBooks, getBook } = require("../controllers/books.controller");

router.get("/", listBooks);
router.get("/:isbn", getBook);

module.exports = router;
