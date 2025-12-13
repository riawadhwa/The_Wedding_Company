const express = require("express");
const router = express.Router();

const { adminLogin } = require("../controllers/orgController");

const auth = require("../middleware/auth");

router.post("/login", adminLogin);

module.exports = router;
