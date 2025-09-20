const pool = require("../util/mysql");

/*
    Create a new user
*/
exports.createUser = function (userData, callback) {
  pool.query(
    "INSERT INTO customer (first_name, last_name, email, password, store_id, address_id) VALUES (?, ?, ?, ?, 1, 1)",
    [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.passwordHash,
    ],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      pool.query(
        "SELECT * FROM customer WHERE customer_id = ?",
        [results.insertId],
        (err, results) => {
          if (err) {
            return callback(err);
          }
          const user = results[0];
          callback(null, user);
        }
      );
    }
  );
};

exports.getUserByEmail = function (email, callback) {
  pool.query(
    "SELECT * FROM customer WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        return callback(err);
      }
      const user = results[0];
      callback(null, user);
    }
  );
};
