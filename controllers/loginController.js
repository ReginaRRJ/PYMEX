//const connection = require("../config/db");
//const jwt = require("jsonwebtoken");
//require("dotenv").config();

// controllers/loginController.js
const hana = require('@sap/hana-client');
require('dotenv').config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

exports.login = (req, res) => {
    const { correo, hashContrasena } = req.body;

    const conn = hana.createConnection();

    // PASO 1: conectar solo si no está conectado
    conn.connect(connParams, (err) => {
      if (err) {
          console.error("Error al conectar a SAP HANA:", err);
          return res.status(500).send("Error conectando a SAP HANA");
      }

      console.log("Conectado a SAP HANA Cloud");

      // PASO 2: preparar SP de forma segura
      const spQuery = 'CALL "DBADMIN"."loginHash"(?, ?)';
      conn.prepare(spQuery, (err, statement) => {
          if (err) {
              console.error("Error preparando SP:", err);
              conn.disconnect();
              return res.status(500).send("Error preparando procedimiento");
          }

          // PASO 4: ejecutar
          statement.exec([correo, hashContrasena], (err, results) => {
              if (err) {
                  console.error("Error ejecutando SP:", err);
                  console.error("Parametros enviados:", correo, hashContrasena)
                  statement.drop();
                  conn.disconnect();
                  return res.status(500).send("Error ejecutando procedimiento");
              }

              console.log("Results:", results);

              if (!results||!results[0]){
                statement.drop();
                conn.disconnect();
                return res.status(500).send("No se recibió respuesta del SP");
              }

              const resultRow = results[0];
              const resultJSON = JSON.parse(resultRow.RESULTADO);

              if (resultJSON.resultado === "Sin acceso") {
                  statement.drop();
                  conn.disconnect();
                  return res.status(401).json({ message: "Credenciales incorrectas" });
              }

              // Login correcto
              statement.drop();
              conn.disconnect();
              return res.status(200).json({
                  token: "fake-token",
                  rol: resultJSON.rol
              });
          });
      });
  });
};

/*const login = async (req, res) => {
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
*/