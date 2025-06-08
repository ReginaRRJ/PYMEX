// Import necessary modules using ES Module syntax
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

// Pendiente por desarrollar (get de notificaciones por usuario)
export const notificacionesByUser = async (req, res) => {
  const { idUsuario } = req.params;

  const conn = hana.createConnection();

  try {
    conn.connect(connParams);

    const query = `CALL "BACKPYMEX"."GETNotUsuario"(?);`;

    conn.prepare(query, (err, statement) => {
      if (err) {
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando la consulta", error: err.toString() });
      }

      // El segundo parámetro es OUT, lo dejamos como null
      statement.exec([parseInt(idUsuario)], (err, results) => { // ojo acá agregué null para el OUT
        statement.drop();
        conn.disconnect();

        if (err) {
          return res.status(500).json({ message: "Error ejecutando el procedimiento", error: err.toString() });
        }

        // results[0] es un objeto con la propiedad RESULTADO_JSON (string JSON)
        const jsonString = results?.[0]?.RESULTADO;

        if (!jsonString) {
          console.log("Resultados:", results);
          return res.json({ message: "Sin notificaciones", resultado: [] });
        }

        try {
          const resultado = JSON.parse(jsonString);
          res.json({ message: "Notificaciones obtenidas", resultado });
        } catch (parseErr) {
          res.status(500).json({ message: "Error parseando JSON", error: parseErr.message });
        }
      });
    });
  } catch (error) {
    conn.disconnect();
    res.status(500).json({ message: "Error en la conexión o ejecución", error: error.toString() });
  }
};


// Pendiente por desarrollar (get de notificaciones por mostrar)
export const alertsByUser = (req, res) => {
  const { idUsuario } = req.params;

  if (!idUsuario) return res.status(400).json({ error: "Falta idUsuario" });

  const conn = hana.createConnection();
  conn.connect(connParams, (err) => {
    if (err) {
      console.error("Conexión fallida:", err);
      return res.status(500).json({ error: "Conexión fallida: " + err.message });
    }

    const sql = `CALL "BACKPYMEX"."GETNotUsuario"(?, ?)`; // IN, OUT

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando consulta", error: err.message });
      }

      // Solo pasamos el parámetro IN (idUsuario)
      statement.exec([parseInt(idUsuario)], (err, rows, outParams) => {
        statement.drop();
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando:", err);
          return res.status(500).json({ message: "Error ejecutando", error: err.message });
        }

        // El OUT viene en outParams (a veces en la propiedad OUT0 o con el nombre definido)
        // Si no funciona con RESULTADO_JSON, intenta con outParams[0] o outParams.OUT0
        const resultadoJson = outParams?.RESULTADO_JSON || outParams?.OUT0 || outParams?.[0];

        if (!resultadoJson) {
          return res.json({ message: "Sin notificaciones", resultado: [] });
        }

        try {
          const resultado = JSON.parse(resultadoJson);
          res.json({ message: "Notificaciones obtenidas", resultado });
        } catch (jsonErr) {
          console.error("Error parseando JSON:", jsonErr);
          res.status(500).json({ message: "Error parseando JSON", error: jsonErr.message });
        }
      });
    });
  });
};
export const notifyClients = (req, res) => {
  const { idPedido, idTipoNotificacion, mensaje } = req.body;

  if (!idPedido || !idTipoNotificacion || !mensaje) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  const conn = hana.createConnection();
  conn.connect(connParams, (err) => {
    if (err) {
      console.error("Conexión fallida:", err);
      return res.status(500).json({ error: "Conexión fallida: " + err.message });
    }

    const sql = `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?)`; // IN, IN, IN

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando consulta", error: err.message });
      }

      // Ejecutar la stored procedure con los tres parámetros
      statement.exec([parseInt(idPedido), parseInt(idTipoNotificacion), mensaje], (err) => {
        statement.drop();
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando:", err);
          return res.status(500).json({ message: "Error ejecutando procedimiento", error: err.message });
        }

        res.json({ message: "Notificaciones enviadas correctamente" });
      });
    });
  });
};




//Get switch 1 (Entrega estimada) state
//Get switch 2 (Automatización) state
//Get time alert button
//Get proveedor-cliente button state
//Change switch 1 (Entrega estimada) state
//Change switch 2 (Automatización) state
//Change time alert button
//Change proveedor-cliente button state