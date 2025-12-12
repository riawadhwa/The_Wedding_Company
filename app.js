const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const auth = require("./middleware/auth");

const {
  createOrg,
  getOrg,
  updateOrg,
  adminLogin,
  deleteOrg,
} = require("./controllers/orgController");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

//routes
app.get("/", (req, res) => res.send("management service"));

app.post("/org/create", createOrg);
app.get("/org/get", getOrg);
app.put("/org/update", updateOrg);
app.post("/admin/login", adminLogin);
app.delete("/org/delete", auth, deleteOrg);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
