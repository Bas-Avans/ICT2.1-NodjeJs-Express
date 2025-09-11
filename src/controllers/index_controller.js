const actorService = require("../services/actors_service");
const filmService = require("../services/films_service");

exports.getIndex = (req, res, next) => {
  filmService.get10MostRentedFilms((err, films) => {
    if (err) {
      return next({ error: err.message });
    }
    actorService.get10MostActiveActors((err, actors) => {
      if (err) {
        return next({ error: err.message });
      }
      res.render("index", { films, actors });
    });
  });
};
