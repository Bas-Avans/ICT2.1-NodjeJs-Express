const express = require("express");
const router = express.Router();
const filmController = require("../controllers/films_controller");
const actorController = require("../controllers/actors_controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* GET all films page */
router.get("/films", filmController.getFilms);
/* GET film by ID page */
router.get("/films/:id", filmController.getFilm);

/* GET all actors page */
router.get("/actors", actorController.getActors);
/* GET actor by ID page */
router.get("/actors/:id", actorController.getActor);

/* GET login page */
router.get("/login", function (req, res, next) {
  res.render("auth/login");
});
/* GET register page */
router.get("/register", function (req, res, next) {
  res.render("auth/register");
});
/* Get account details page */
router.get("/account", function (req, res, next) {
  res.render("auth/account");
});

module.exports = router;
