const router = require("express").Router();
const { chat } = require("../controllers/chat.controller");

// public endpoint
router.post("/", chat);

module.exports = router;
