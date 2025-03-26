const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM USERS WHERE EMAIL = ?`;
    connection.exec(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      const token = jwt.sign({ userId: user.ID }, process.env.SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };