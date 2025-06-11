import hana from "@sap/hana-client";
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

//Obtener configuración de las notificaciones
export const getNotificationConfig = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `
    SELECT
      cn."idNotificacion",
      tn."nombre",
      cn."activo",
      tn."descripcion",
      cn."parametroTiempo"
    FROM "BACKPYMEX"."ConfiguracionNotificacion" cn
    JOIN "BACKPYMEX"."TipoNotificacion" tn ON cn."idNotificacion" = tn."idNotificacion"
    WHERE cn."idUsuario" = ?;
  `;

  try {
    const conn = hana.createConnection();
    conn.connect(connParams);

    
    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error('Error preparando sentencia:', err);
        return res.status(500).json({ error: 'Error preparando sentencia' });
      }

      stmt.exec([idUsuario], (err, rows) => {
        if (err) {
          console.error('Error preparando sentenciat:', err);
          return res.status(500).json({ error: 'Error preparando sentencia' });
        }

        res.json(rows);
        conn.disconnect();
      });
    });
  } catch (error) {
    console.error('Error obteniendo configuración de las notificaciones:', error);
    res.status(500).json({ error: 'Error obteniendo configuración de las notificaciones' });
  }
};

//Actualizar configuración de las notificaciones
export const updateNotificationConfig = async (req, res) => {
  const { idUsuario } = req.params;
  const { idNotificacion, activo } = req.body;
  const parametroTiempo = 12;

  const query = `
    UPDATE "BACKPYMEX"."ConfiguracionNotificacion"
    SET "activo" = ?, "parametroTiempo" = ?
    WHERE "idUsuario" = ? AND "idNotificacion" = ?;
  `;

  try {
    const conn = hana.createConnection();
    conn.connect(connParams);

    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error('Error preparando sentencia:', err);
        return res.status(500).json({ error: 'Errror preparando sentencia' });
      }

      stmt.exec([activo, parametroTiempo, idUsuario, idNotificacion], (err, result) => {
        if (err) {
          console.error('Error preparando sentencia:', err);
          return res.status(500).json({ error: 'Error preparando sentencia' });
        }

        res.status(200).json({ message: "Cambio de configuración exitosa" });
        conn.disconnect();
      });
    });
  } catch (error) {
    console.error('Error actualizando configuración de las notificaciones:', error);
    res.status(500).json({ error: 'Error actualizando configuración de las notificaciones' });
  }
};