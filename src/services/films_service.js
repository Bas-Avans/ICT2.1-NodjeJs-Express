const pool = require("../util/mysql");

/*
  Get a film by its ID
*/
exports.getFilmById = (filmId, callback) => {
  pool.query(
    "SELECT * FROM film f JOIN film_category fc ON f.film_id=fc.film_id JOIN category c ON c.category_id=fc.category_id WHERE f.film_id = ?",
    [filmId],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      const film = results[0];

      pool.query(
        "SELECT * FROM actor a JOIN film_actor fa ON a.actor_id=fa.actor_id WHERE fa.film_id=?",
        [filmId],
        (err, actorResults) => {
          if (err) {
            return callback(err);
          }
          film.cast = actorResults;

          callback(null, film);
        }
      );
    }
  );
};

/* 
  search the database for films matching the search query 
  and taking pagination into account
*/
exports.searchFilms = (searchQuery, page, pageSize, callback) => {
  const likeQuery = `%${searchQuery}%`;
  const offset = (page - 1) * pageSize;

  pool.query(
    "SELECT COUNT(*) AS count FROM film WHERE title LIKE ?",
    [likeQuery],
    (err, countResults) => {
      if (err) return callback(err);
      const totalCount = countResults[0].count;

      pool.query(
        "SELECT * FROM film WHERE title LIKE ? LIMIT ? OFFSET ?",
        [likeQuery, pageSize, offset],
        (err, filmResults) => {
          if (err) return callback(err);

          callback(null, { films: filmResults, totalCount });
        }
      );
    }
  );
};
