import hana from '@sap/hana-client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

const SECRET_KEY = process.env.SECRET_KEY || 'secretPYME123';

//Para verificar token
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: "Token no recibido" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: "Token malformado" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = decoded; 
    next();
  });
}

export const login = (req, res) => {
    const { correo, hashContrasena } = req.body;

    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
      if (err) {
          console.error("Error al conectar a SAP HANA:", err);
          return res.status(500).send("Error conectando a SAP HANA");
      }

      console.log("Conectado a SAP HANA Cloud");

      const spQuery = 'CALL "BACKPYMEX"."loginHash"(?, ?)';
      conn.prepare(spQuery, (err, statement) => {
          if (err) {
              console.error("Error preparando SP:", err);
              conn.disconnect();
              return res.status(500).send("Error preparando procedimiento");
          }

          statement.exec([correo, hashContrasena], (err, results) => {
              if (err) {
                  console.error("Error ejecutando SP:", err);
                  console.error("Parametros enviados:", correo, hashContrasena);
                  statement.drop();
                  conn.disconnect();
                  return res.status(500).send("Error ejecutando procedimiento");
              }

              if (!results || !results[0]) {
                statement.drop();
                conn.disconnect();
                return res.status(500).send("No se recibió respuesta del SP");
              }

              const resultRow = results[0];
              let resultJSON;
              try {
                resultJSON = JSON.parse(resultRow.RESULTADO);
              } catch(parseErr) {
                console.error("Error al parsear JSON:", parseErr);
                statement.drop();
                conn.disconnect();
                return res.status(500).send("Error procesando respuesta del servidor");
              }

              if (resultJSON.resultado === "Sin acceso") {
                  statement.drop();
                  conn.disconnect();
                  return res.status(401).json({ message: "Credenciales incorrectas" });
              }

              const payload = {
                idUsuario: resultJSON.idUsuario,
                correo: resultJSON.correo,
                rol: resultJSON.rol
              };

              const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
              console.log("JWT:",token)
              statement.drop();
              conn.disconnect();

              return res.status(200).json({
                  token,
                  rol: resultJSON.rol,
                  usuario: {
                    idUsuario: resultJSON.idUsuario,
                    correo: resultJSON.correo,
                    nombreCompleto: resultJSON.nombreCompleto,
                    rol: resultJSON.rol,
                    idPyme: resultJSON.idPyme,
                    nombrePyme: resultJSON.nombrePyme,
                    idSucursal: resultJSON.idSucursal
                  }
              });
          });
      });
  });
};

export const loginNotificacion = (req, res) => {
  const { idUsuario } = req.body;

  if (!idUsuario) return res.status(400).json({ error: "Falta idUsuario" });

  const conn = hana.createConnection();
  conn.connect(connParams, (err) => {
    if (err) {
      console.error("Conexión fallida:", err);
      return res.status(500).json({ error: "Conexión fallida: " + err });
    }

    const sql = `CALL "BACKPYMEX"."N2Sucursal"(?)`;

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ error: "Error preparando consulta" });
      }

      statement.exec([idUsuario], (err, rows) => {
        statement.drop();
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando:", err);
          return res.status(500).json({ error: "Error ejecutando: " + err });
        }

        const resultado = rows?.[0]?.RESULTADO_JSON || "Sin respuesta";
        res.json({ message: "Notificación generada", resultado });
        console.log("Resultado de la notificación:", resultado);
      });
    });
  });
};
