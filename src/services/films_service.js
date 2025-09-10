const pool = require("../util/mysql");

/*
  Get a film by its ID
*/
exports.getFilmById = (filmId, callback) => {
  pool.query(
    "SELECT * FROM film WHERE film_id = ?",
    [filmId],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
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
