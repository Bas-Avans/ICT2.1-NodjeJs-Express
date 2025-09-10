const express = require("express");
const router = express.Router();
const filmController = require("../controllers/films_controller");
const actorController = require("../controllers/actors_controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET all films */
router.get("/films", filmController.getFilms);

/* GET film by ID */
router.get("/films/:id", filmController.getFilm);

/* GET all actors */
router.get("/actors", actorController.getActors);

/* GET actor by ID */
router.get("/actors/:id", actorController.getActor);

module.exports = router;
