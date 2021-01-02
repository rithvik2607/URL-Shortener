const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const urlRoutes = require("./routes/urlOperations");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.json());
app.use("./public", express.static(process.cwd() + "/public"));
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/view/index.html");
});
app.get("/api/hello", (req, res) => {
  res.json({greeting: "Hello API"});
});
app.use("/api", urlRoutes);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // serverSelectionTimeoutMS: 5000 //By default this is 30s, we changed that to 5s
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error"));
connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));