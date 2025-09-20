const filmService = require("../services/films_service");
const rentalService = require("../services/rentals_service");
const { getPagination } = require("../util/pagination");

/*
  Return the films page
*/
exports.getFilms = (req, res, next) => {
  const searchQuery = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 12;

  filmService.searchFilms(searchQuery, page, pageSize, (err, result) => {
    if (err) {
      next({ error: err.message });
    } else {
      const totalPages = Math.ceil(result.totalCount / pageSize);
      const pagination = getPagination(page, totalPages);
      const model = {
        films: result.films,
        searchQuery,
        currentPage: page,
        totalCount: result.totalCount,
        totalPages,
        pagination,
        path: "films",
      };
      res.render("film/films", model);
    }
  });
};

/*
  Return the film details page
*/
exports.getFilm = (req, res, next) => {
  const filmId = req.params.id;

  filmService.getFilmById(filmId, (err, film) => {
    if (err) {
      next({ error: err.message });
    } else {
      rentalService.checkFilmInventory(filmId, (err, availableCount) => {
        if (err) {
          return next({ error: err.message });
        }
        const model = { film, availableCount };
        const view = "film/film";
        res.render(view, model);
      });
    }
  });
};
