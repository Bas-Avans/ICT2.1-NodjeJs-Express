const pool = require("../util/mysql");

/*
  Get a actor by its ID
*/
exports.getActorById = (actorId, callback) => {
  pool.query(
    "SELECT * FROM actor WHERE actor_id = ?",
    [actorId],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      const actor = results[0];

      pool.query(
        "SELECT * FROM film AS f JOIN film_actor AS fa ON f.film_id=fa.film_id WHERE fa.actor_id=?",
        [actorId],
        (err, filmResults) => {
          if (err) {
            return callback(err);
          }
          actor.films = filmResults;

          callback(null, actor);
        }
      );
    }
  );
};

/* 
  search the database for actors matching the search query 
  and taking pagination into account
*/
exports.searchActors = (searchQuery, page, pageSize, callback) => {
  const likeQuery = `%${searchQuery}%`;
  const offset = (page - 1) * pageSize;

  pool.query(
    "SELECT COUNT(*) AS count FROM actor WHERE CONCAT(first_name, ' ', last_name) LIKE ?",
    [likeQuery],
    (err, countResults) => {
      if (err) return callback(err);
      const totalCount = countResults[0].count;

      pool.query(
        "SELECT * FROM actor WHERE CONCAT(first_name, ' ', last_name) LIKE ? LIMIT ? OFFSET ?",
        [likeQuery, pageSize, offset],
        (err, actorResults) => {
          if (err) return callback(err);

          callback(null, { actors: actorResults, totalCount });
        }
      );
    }
  );
};

exports.get10MostActiveActors = (callback) => {
  pool.query(
    `SELECT a.*, COUNT(fa.film_id) AS film_count FROM actor a 
    JOIN film_actor fa ON a.actor_id = fa.actor_id 
    GROUP BY a.actor_id 
    ORDER BY film_count 
    DESC 
    LIMIT 10`,
    (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    }
  );
};
