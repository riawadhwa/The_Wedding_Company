const express = require("express");
const router = express.Router();

const { adminLogin } = require("../controllers/orgController");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post("/login", loginLimiter, adminLogin);

module.exports = router;
