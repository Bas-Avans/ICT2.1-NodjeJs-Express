const actorService = require("../services/actors_service");
const { getPagination } = require("../util/pagination");

/*
  Return the actors page
*/
exports.getActors = (req, res, next) => {
  const searchQuery = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 12;

  actorService.searchActors(searchQuery, page, pageSize, (err, result) => {
    if (err) {
      next({ error: err.message });
    } else {
      const totalPages = Math.ceil(result.totalCount / pageSize);
      const pagination = getPagination(page, totalPages);
      const model = {
        actors: result.actors,
        searchQuery,
        currentPage: page,
        totalPages,
        pagination,
        path: "actors",
      };
      res.render("actor/actors", model);
    }
  });
};

/*
  Return the actor details page
*/
exports.getActor = (req, res, next) => {
  const actorId = req.params.id;

  actorService.getActorById(actorId, (err, actor) => {
    if (err) {
      next({ error: err.message });
    } else {
      const model = { actor };
      const view = "actor/actor";
      res.render(view, model);
    }
  });
};
