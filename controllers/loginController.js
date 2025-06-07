// Import necessary modules using ES Module syntax
import hana from '@sap/hana-client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

const SECRET_KEY = process.env.JWT_SECRET || 'secretPYME123';

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
        statement.drop();
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando SP:", err);
          console.error("Parametros enviados:", correo, hashContrasena);
          return res.status(500).send("Error ejecutando procedimiento");
        }

        if (!results || !results[0]) {
          return res.status(500).send("No se recibió respuesta del SP");
        }

        const resultRow = results[0];
        let resultJSON;

        try {
          resultJSON = JSON.parse(resultRow.RESULTADO);
        } catch (parseError) {
          console.error("Error al parsear JSON:", parseError);
          return res.status(500).send("Error procesando respuesta del servidor");
        }

        if (resultJSON.resultado === "Sin acceso") {
          return res.status(401).json({ message: "Credenciales incorrectas" });
        }

     
        const payload = {
          idUsuario: resultJSON.idUsuario,
          correo: resultJSON.correo,
          rol: resultJSON.rol
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

      console.log("JWT Token generado:", token);
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

// // Import necessary modules using ES Module syntax
// import hana from '@sap/hana-client';
// import dotenv from 'dotenv';

// dotenv.config();

// const connParams = {
//     serverNode: process.env.DB_HOST,
//     uid: process.env.DB_USER,
//     pwd: process.env.DB_PASSWORD
// };

// export const login = (req, res) => {
//     const { correo, hashContrasena } = req.body;

//     const conn = hana.createConnection();

//     // PASO 1: conectar solo si no está conectado
//     conn.connect(connParams, (err) => {
//       if (err) {
//           console.error("Error al conectar a SAP HANA:", err);
//           return res.status(500).send("Error conectando a SAP HANA");
//       }

//       console.log("Conectado a SAP HANA Cloud");

//       // PASO 2: preparar SP de forma segura
//       const spQuery = 'CALL "DBADMIN"."loginHash"(?, ?)';
//       conn.prepare(spQuery, (err, statement) => {
//           if (err) {
//               console.error("Error preparando SP:", err);
//               conn.disconnect();
//               return res.status(500).send("Error preparando procedimiento");
//           }

//           // PASO 4: ejecutar
//           statement.exec([correo, hashContrasena], (err, results) => {
//               if (err) {
//                   console.error("Error ejecutando SP:", err);
//                   console.error("Parametros enviados:", correo, hashContrasena);
//                   statement.drop();
//                   conn.disconnect();
//                   return res.status(500).send("Error ejecutando procedimiento");
//               }

//               console.log("Results from SP:", results); 

//               if (!results || results.length === 0 || !results[0]) {
//                 statement.drop();
//                 conn.disconnect();
//                 return res.status(500).send("No se recibió una fila de respuesta válida del SP");
//               }

//               const resultRow = results[0];

    
//               console.log("Value of resultRow.RESULTADO:", resultRow.RESULTADO);
              
//               console.log("Keys in resultRow:", Object.keys(resultRow));


//               let resultJSON;
//               try {
               
//                   if (typeof resultRow.RESULTADO === 'string') {
//                       resultJSON = JSON.parse(resultRow.RESULTADO);
//                   } else {
                      
//                       console.error("resultRow.RESULTADO is not a string, cannot parse as JSON.");
//                       statement.drop();
//                       conn.disconnect();
//                       return res.status(500).send("Formato de respuesta del SP inesperado");
//                   }
//               } catch (parseError) {
//                   console.error("Error al parsear JSON de la respuesta del SP:", parseError);
//                   statement.drop();
//                   conn.disconnect();
//                   return res.status(500).send("Error procesando respuesta del servidor (JSON inválido)");
//               }

              
//               if (resultJSON.resultado === "Sin acceso") { 
//                   statement.drop();
//                   conn.disconnect();
//                   return res.status(401).json({ message: "Credenciales incorrectas" });
//               }

             
//               statement.drop();
//               conn.disconnect();
//               return res.status(200).json({
//                   token: "fake-token",
//                   rol: resultJSON.rol,
//                   usuario: {
//                     idUsuario: resultJSON.idUsuario,
//                     correo: resultJSON.correo,
//                     nombreCompleto: resultJSON.nombreCompleto,
//                     rol: resultJSON.rol,
//                     idPyme: resultJSON.idPyme,
//                     nombrePyme: resultJSON.nombrePyme,
//                     idSucursal: resultJSON.idSucursal
//                 }
//               });
//           });
//       });
//   });
// };
