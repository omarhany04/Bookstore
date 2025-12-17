const router = require("express").Router();
const { register, login, me, updateMe } = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.patch("/me", auth, updateMe);

module.exports = router;
