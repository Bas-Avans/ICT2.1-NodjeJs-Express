const pool = require("../util/mysql");

exports.getRentalsByUserId = function (userId, callback) {
  pool.query(
    "SELECT r.rental_id, r.rental_date, r.return_date, f.title, f.film_id FROM rental r JOIN inventory i ON r.inventory_id = i.inventory_id JOIN film f ON i.film_id = f.film_id WHERE r.customer_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    }
  );
};

exports.checkFilmInventory = function (filmId, callback) {
  pool.query(
    `SELECT COUNT(*) AS count
    FROM inventory i
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
    WHERE i.film_id = ? AND r.rental_id IS NULL
    `,
    [filmId],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      const count = results[0].count;
      callback(null, count);
    }
  );
};

exports.createRental = function (userId, filmId, callback) {
  this.checkFilmInventory(filmId, (err, availableCount) => {
    if (err) {
      return callback(err);
    }
    if (availableCount <= 0) {
      return callback(new Error("No available inventory for this film."));
    }
    const rentalDate = new Date();
    pool.query(
      `INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
      VALUES (?, (SELECT inventory_id FROM inventory WHERE film_id = ? LIMIT 1), ?, 1)`,
      [rentalDate, filmId, userId],
      (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      }
    );
  });
};

exports.returnRental = function (userId, rentalId, callback) {
  const returnDate = new Date();
  pool.query(
    "UPDATE rental SET return_date = ? WHERE rental_id = ? AND customer_id = ?",
    [returnDate, rentalId, userId],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.affectedRows === 0) {
        return callback(new Error("No such rental found for this user."));
      }
      callback(null);
    }
  );
};
