const express = require("express");
const router = express.Router();
const filmController = require("../controllers/films_controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET all films */
router.get("/films", filmController.getFilms);

/* GET film by ID */
router.get("/films/:id", filmController.getFilm);

module.exports = router;
