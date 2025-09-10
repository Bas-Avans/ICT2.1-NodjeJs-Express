const filmService = require("../services/films_service");

exports.getFilms = (req, res, next) => {
  const searchQuery = req.query.search || "";

  filmService.searchFilms(searchQuery, (err, films) => {
    if (err) {
      next({ error: err.message });
    } else {
      const model = { films, searchQuery };
      const view = "films";
      res.render(view, model);
    }
  });
};

exports.getFilm = (req, res, next) => {
  const filmId = req.params.id;

  filmService.getFilmById(filmId, (err, film) => {
    if (err) {
      next({ error: err.message });
    } else {
      const model = { film };
      const view = "film";
      res.render(view, model);
    }
  });
};
