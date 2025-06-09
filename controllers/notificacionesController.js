import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

//Obtener notificaciones de cada usuario
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

      statement.exec([parseInt(idUsuario)], (err, results) => { 
        statement.drop();
        conn.disconnect();

        if (err) {
          return res.status(500).json({ message: "Error ejecutando el procedimiento", error: err.toString() });
        }

        const jsonString = results?.[0]?.RESULTADO;

        if (!jsonString) {
          console.log("Resultados:", results);
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          res.set('Surrogate-Control', 'no-store');

          return res.json({ message: "Sin notificaciones", resultado: [] });
        }

        try {
          const resultado = JSON.parse(jsonString);
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          res.set('Surrogate-Control', 'no-store');

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


//Obtener notificaciones para mostrar
export const alertsByUser = (req, res) => {
  const { idUsuario } = req.params;

  if (!idUsuario) return res.status(400).json({ error: "Falta idUsuario" });

  const conn = hana.createConnection();
  conn.connect(connParams, (err) => {
    if (err) {
      console.error("Conexión fallida:", err);
      return res.status(500).json({ error: "Conexión fallida: " + err.message });
    }

    const sql = `CALL "BACKPYMEX"."GETNotUsuario"(?, ?)`; 

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando consulta", error: err.message });
      }

      statement.exec([parseInt(idUsuario)], (err, rows, outParams) => {
        statement.drop();
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando:", err);
          return res.status(500).json({ message: "Error ejecutando", error: err.message });
        }

        const resultadoJson = outParams?.RESULTADO_JSON || outParams?.OUT0 || outParams?.[0];

        if (!resultadoJson) {
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          res.set('Surrogate-Control', 'no-store');

          return res.json({ message: "Sin notificaciones", resultado: [] });

        }

        try {
          const resultado = JSON.parse(resultadoJson);
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          res.set('Surrogate-Control', 'no-store');

          res.json({ message: "Notificaciones obtenidas", resultado });
        } catch (jsonErr) {
          console.error("Error parseando JSON:", jsonErr);
          res.status(500).json({ message: "Error parseando JSON", error: jsonErr.message });
        }
      });
    });
  });
};

//Generación de notificaciones
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

    const sql = `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?)`; 

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando consulta", error: err.message });
      }


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

//Generar notificación de cambios hechos por el cliente
export const actualizarPedidoCliente=(req,res)=>{
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

    const sql = `CALL "BACKPYMEX"."N5Proveedor"(?, ?, ?)`; 

    conn.prepare(sql, (err, statement) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ message: "Error preparando consulta", error: err.message });
      }

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

//Cambiar estado de notificación a leída
export const notificacionLeida = async (req, res) => {
  
  const idMensaje = parseInt(req.params.idMensaje, 10);

  const conn = hana.createConnection();
  try {
    conn.connect(connParams);

    const sqlGet = `
      SELECT "leida"
      FROM "BACKPYMEX"."NotificacionMensajeUsuario"
      WHERE "id_mensaje" = ?
    `;
    const getStmt = await new Promise((resolve, reject) =>
      conn.prepare(sqlGet, (err, stmt) => err ? reject(err) : resolve(stmt))
    );
    const rows = await new Promise((resolve, reject) =>
      getStmt.exec([idMensaje], (err, result) => {
        getStmt.drop();
        if (err) return reject(err);
        resolve(result);
      })
    );

    if (rows.length === 0) {
      conn.disconnect();
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    const leidaActual = rows[0].leida;
    if (leidaActual === true || leidaActual === 'true') {
      conn.disconnect();
      return res.status(200).json({ message: 'Ya estaba marcada como leída', leida: true });
    }

    const sqlUpdate = `
      UPDATE "BACKPYMEX"."NotificacionMensajeUsuario"
      SET "leida" = TRUE
      WHERE "id_mensaje" = ?
    `;
    const updStmt = await new Promise((resolve, reject) =>
      conn.prepare(sqlUpdate, (err, stmt) => err ? reject(err) : resolve(stmt))
    );
    await new Promise((resolve, reject) =>
      updStmt.exec([idMensaje], (err) => {
        updStmt.drop();
        if (err) return reject(err);
        resolve();
      })
    );

    await new Promise((resolve, reject) => {
      conn.commit((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    conn.disconnect();
    return res.status(200).json({ message: 'Marcada como leída', leida: true });
  } catch (error) {
    console.error('Error actualizando notificación:', error);
    if (conn) {
      conn.rollback(() => {
        console.error("Transacción fallida debido a un error.");
      });
      conn.disconnect();
    }
    return res.status(500).json({
      message: 'Error al actualizar notificación',
      error: error.toString()
    });
  }
};