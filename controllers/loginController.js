// Import necessary modules using ES Module syntax
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

export const login = (req, res) => {
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
                  console.error("Parametros enviados:", correo, hashContrasena);
                  statement.drop();
                  conn.disconnect();
                  return res.status(500).send("Error ejecutando procedimiento");
              }

              console.log("Results:", results);

              if (!results || !results[0]) {
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
                  rol: resultJSON.rol,
                  usuario: {
                    idUsuario: resultJSON.idUsuario,
                    correo: resultJSON.correo,
                    nombreCompleto: resultJSON.nombreCompleto,
                    rol: resultJSON.rol,
                    idPyme: resultJSON.idPyme,
                    nombrePyme: resultJSON.nombrePyme
                }
              });
          });
      });
  });
};