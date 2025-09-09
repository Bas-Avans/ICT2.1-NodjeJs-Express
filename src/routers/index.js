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

var filmData = [];

connection.connect();

connection.query("SELECT * FROM film", (err, rows, fields) => {
  if (err) throw err;

  filmData = rows;
});

connection.end();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { films: filmData });
});

router.get("/films/:id", function (req, res, next) {
  const film = filmData.find((f) => f.film_id === parseInt(req.params.id));
  if (!film) {
    return res.status(404).send("Film not found");
  }
  res.render("film", { film });
});

module.exports = router;
