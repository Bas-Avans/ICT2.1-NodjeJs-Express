require("dotenv").config();

var express = require("express");
var router = express.Router();

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect();

connection.query("SELECT * FROM film", (err, rows, fields) => {
  if (err) throw err;

  console.log(rows[0]);
});

connection.end();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
