const router = require("express").Router();
const { listCategories } = require("../controllers/categories.controller");

router.get("/", listCategories);

module.exports = router;
