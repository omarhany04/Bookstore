const router = require("express").Router();
const { listPublishers } = require("../controllers/publishers.controller");

router.get("/", listPublishers);

module.exports = router;
