require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const app = express();
const port = process.env.PORT || 3000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose
  .connect(MONGO_DB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
