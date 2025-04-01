const connection = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
require("dotenv").config();


const hashPassword = (password) => {
  return crypto.createHash("sha256").update(Buffer.from(password, "utf8")).digest("hex").toUpperCase(); 

};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: "Correo and Contraseña are required" });
    }

    if (!connection) {
      console.error("Database connection is not established.");
      return res.status(500).json({ error: "Database connection failed" });
    }

    const query = 'SELECT * FROM "Usuario" WHERE "correo" = ?';
    console.log("Running query:", query, correo);

    connection.prepare(query, (err, statement) => {
      if (err) {
        console.error("Error preparing statement:", err);
        return res.status(500).json({ error: "Database preparation error", details: err.message });
      }

      statement.exec([correo], async (err, result) => {
        if (err) {
          console.error("Database query execution error:", err);
          return res.status(500).json({ error: "Database query error", details: err.message });
        }

        if (!result || result.length === 0) {
          return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = result[0];
        //const hashedInputPassword = hashPassword(contrasena); 
        const hashedInputPassword = contrasena;
        //console.log("Hashed Input Password:", hashedInputPassword);
        console.log("Hashed Input Password:", hashedInputPassword);
        //console.log("Stored Password Hash:", user.contrasena);

        
        if (hashedInputPassword !== user.contrasena) {
          return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
          console.error("SECRET_KEY is not defined in .env");
          return res.status(500).json({ message: "Secret key not defined" });
        }

        console.log("SECRET_KEY:", secretKey);

        const token = jwt.sign(
          { idUsuario: user.idUsuario, correo: user.correo, rol: user.rol },
          secretKey,
          { expiresIn: "1h" }
        );

        res.json({ token, rol: user.rol });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };
