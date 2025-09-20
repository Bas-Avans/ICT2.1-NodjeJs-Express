const express = require("express");
const router = express.Router();
const filmController = require("../controllers/films_controller");
const actorController = require("../controllers/actors_controller");
const indexController = require("../controllers/index_controller");
const rentalsController = require("../controllers/rentals_controller");

/* GET home page. */
router.get("/", indexController.getIndex);

/* GET all films page */
router.get("/films", filmController.getFilms);
/* GET film by ID page */
router.get("/films/:id", filmController.getFilm);

/* GET all actors page */
router.get("/actors", actorController.getActors);
/* GET actor by ID page */
router.get("/actors/:id", actorController.getActor);
/* GET rentals page */
router.get("/rentals", rentalsController.getRentals);

/* POST create a new rental */
router.post("/rentals", rentalsController.createRental);
/* POST return a rental */
router.post("/rentals/:id/return", rentalsController.returnRental);

module.exports = router;
