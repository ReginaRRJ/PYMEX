// Example of an Express.js route handler for login
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db"); // Assume this is where your database connection is managed

const router = express.Router();

// POST route to login
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body; // 'correo' is email, 'contrasena' is password

  try {
    // Look up the user by email
    const query = `SELECT * FROM Usuario WHERE correo = ?`;
    const user = await db.query(query, [correo]); // Assuming you're using MySQL or similar

    if (!user || user.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(contrasena, user[0].contrasena);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({ idUsuario: user[0].idUsuario }, "your-secret-key", { expiresIn: "1h" });

    // Send the token back to the client
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
