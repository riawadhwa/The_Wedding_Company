const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { createOrg, getOrg, updateOrg } = require("./controllers/orgController");

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

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
