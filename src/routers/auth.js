const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

/* GET login page */
router.get("/login", authController.login);
/* GET register page */
router.get("/register", authController.register);
/* GET account details page */
router.get("/account", authController.account);

/* POST login */
router.post("/login", authController.handleLogin);
/* POST register */
router.post("/register", authController.handleRegister);
/* POST logout */
router.post("/logout", authController.handleLogout);

module.exports = router;
