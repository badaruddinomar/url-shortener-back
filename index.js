// ALL IMPORTS--
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const ShortUrl = require("./models/shortUrl");

// CREATE EXPRESS APP--
const app = express();

// ALL MIDDLEWARES--
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// DATABSE CONNECTIONS--
mongoose
  .connect(process.env.DB, {})
  .then(() => console.log("database connected!"))
  .catch((err) => console.log(err.message));
// ALL ROUTES--
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/createShortUrl", async (req, res) => {
  try {
    const { fullUrl } = req.body;
    if (!fullUrl) {
      res.status(404).json({ message: "Please enter a URL", success: false });
      return;
    }
    const url = await ShortUrl.create({ fullUrl });
    res.status(200).json({
      message: "Short URL created successfully",
      success: true,
      url,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
      success: false,
    });
  }
});
app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    if (!shortUrl) {
      res.sendStatus(404);
      return;
    }
    const url = await ShortUrl.findOne({ shortUrl });
    res.status(200).json({
      url,
      success: true,
    });
  } catch (error) {
    res.sendStatus(404);
  }
});
// SERVER CONNECTIONS--
app.listen(process.env.PORT || 4000, () => {
  console.log("server is running on port 4000");
});
