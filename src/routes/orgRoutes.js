const express = require("express");
const router = express.Router();

const {
  createOrg,
  getOrg,
  updateOrg,
  deleteOrg,
} = require("../controllers/orgController");

const auth = require("../middleware/auth");

// Organization routes
router.post("/create", createOrg);
router.get("/get", getOrg);
router.put("/update", updateOrg);
router.delete("/delete", auth, deleteOrg);

module.exports = router;
