const bcrypt = require("bcrypt");
const authService = require("../services/auth_service");

exports.login = function (req, res, next) {
  res.render("auth/login");
};

exports.register = function (req, res, next) {
  res.render("auth/register");
};

exports.account = function (req, res, next) {
  if (!!req.session.user) {
    res.render("auth/account");
  } else {
    res.redirect("/login");
  }
};

// Handle login logic here
exports.handleLogin = function (req, res, next) {
  const { email, password } = req.body;
  const user = { id: 1, email: email, firstName: "John", lastName: "Doe" };
  req.session.user = user;
  res.redirect("/");
};

// Handle registration logic here
exports.handleRegister = function (req, res, next) {
  const { firstname, lastname, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);

  const userData = {
    firstName: firstname,
    lastName: lastname,
    email: email,
    passwordHash: passwordHash,
  };

  authService.createUser(userData, (err, userId) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.handleLogout = function (req, res, next) {
  if (req.session) {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  } else {
    res.redirect("/login");
  }
};
