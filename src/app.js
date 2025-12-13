const express = require("express");
const mongoose = require("mongoose");

const orgRoutes = require("./routes/orgRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

app.use("/org", orgRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
