// loginRoutes.js
const express = require("express");
const router = express.Router();
const loginController = require('../controllers/loginController');

// Login route
router.post("/", loginController.login);  // This POST route is for logging in

module.exports = router;
