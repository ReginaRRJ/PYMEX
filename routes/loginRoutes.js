// loginRoutes.js
import express from "express";
import { login } from "../controllers/loginController.js"; // Using named import for the login function

const router = express.Router();

// Login route
router.post("/", login); // This POST route is for logging in

export default router; // Exporting the router using ES Module syntax
