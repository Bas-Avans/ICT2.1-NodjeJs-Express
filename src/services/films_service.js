const pool = require("../util/mysql");

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

exports.searchFilms = (searchQuery, callback) => {
  pool.query(
    "SELECT * FROM film WHERE title LIKE ?",
    [`%${searchQuery}%`],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    }
  );
};
