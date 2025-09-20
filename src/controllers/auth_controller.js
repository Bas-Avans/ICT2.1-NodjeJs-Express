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
  authService.getUserByEmail(email, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("auth/login", { error: "Invalid email or password." });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.render("auth/login", { error: "Invalid email or password." });
    }
    req.session.user = user;
    res.redirect("/");
  });
};

// Handle registration logic here
exports.handleRegister = function (req, res, next) {
  const { first_name, last_name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.render("auth/register", {
      error: "Password and confirmation do not match.",
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const userData = {
    firstName: first_name,
    lastName: last_name,
    email: email,
    passwordHash: passwordHash,
  };

  authService.createUser(userData, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("auth/register", {
        error: "Registration failed. Please try again.",
      });
    }
    req.session.user = user;
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

exports.updateAccount = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { first_name, last_name, email } = req.body;
  const userId = req.session.user.customer_id;

  // Update user details in the database
  authService.updateUserDetails(userId, first_name, last_name, email, (err) => {
    if (err) {
      return next(err);
    }
    // Update session user data
    req.session.user.first_name = first_name;
    req.session.user.last_name = last_name;
    req.session.user.email = email;

    res.render("auth/account", {
      updateSuccess: "Account details updated successfully.",
    });
  });
};

exports.changePassword = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { current_password, new_password, confirm_password } = req.body;
  const userId = req.session.user.customer_id;
  const email = req.session.user.email;

  if (new_password !== confirm_password) {
    return res.render("auth/account", {
      passwordError: "New password and confirmation do not match.",
    });
  }

  const passwordMatch = bcrypt.compareSync(
    current_password,
    req.session.user.password
  );
  if (!passwordMatch) {
    return res.render("auth/account", {
      passwordError: "Current password is incorrect.",
    });
  }

  const newPasswordHash = bcrypt.hashSync(new_password, 10);
  authService.updateUserPassword(userId, newPasswordHash, (err) => {
    if (err) {
      return next(err);
    }
    res.render("auth/account", {
      updateSuccess: "Password updated successfully.",
    });
  });
};

exports.deleteAccount = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.user.customer_id;

  authService.deleteUser(userId, (err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/register");
    });
  });
};
