const pool = require("../util/mysql");

/*
    Create a new user
*/
exports.createUser = function (userData, callback) {
  pool.query(
    "INSERT INTO customer (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
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
      callback(null, results.insertId);
    }
  );
};
