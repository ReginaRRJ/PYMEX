import hana from "@sap/hana-client";
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

export const getNotificationConfig = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `
    SELECT
      cn."idNotificacion",
      tn."nombre",
      cn."activo",
      tn."descripcion",
      cn."parametroTiempo"
    FROM "DBADMIN"."ConfiguracionNotificacion" cn
    JOIN "DBADMIN"."TipoNotificacion" tn ON cn."idNotificacion" = tn."idNotificacion"
    WHERE cn."idUsuario" = ?;
  `;

  try {
    const conn = hana.createConnection();
    conn.connect(connParams);

    // Use a prepared statement and execute directly with parameters
    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error('Error preparing statement:', err);
        return res.status(500).json({ error: 'Error preparing statement' });
      }

      stmt.exec([idUsuario], (err, rows) => {
        if (err) {
          console.error('Error executing statement:', err);
          return res.status(500).json({ error: 'Error executing statement' });
        }

        res.json(rows);
        conn.disconnect();
      });
    });
  } catch (error) {
    console.error('Error fetching notification configuration:', error);
    res.status(500).json({ error: 'Error fetching notification configuration' });
  }
};


export const updateNotificationConfig = async (req, res) => {
  const { idUsuario } = req.params;
  const { idNotificacion, activo } = req.body;
  const parametroTiempo = 12;

  const query = `
    UPDATE "DBADMIN"."ConfiguracionNotificacion"
    SET "activo" = ?, "parametroTiempo" = ?
    WHERE "idUsuario" = ? AND "idNotificacion" = ?;
  `;

  try {
    const conn = hana.createConnection();
    conn.connect(connParams);

    // Directly use the connection's `prepare` and `exec` with a callback
    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error('Error preparing statement:', err);
        return res.status(500).json({ error: 'Error preparing statement' });
      }

      stmt.exec([activo, parametroTiempo, idUsuario, idNotificacion], (err, result) => {
        if (err) {
          console.error('Error executing statement:', err);
          return res.status(500).json({ error: 'Error executing statement' });
        }

        res.status(200).json({ message: "Notification configuration updated successfully" });
        conn.disconnect();
      });
    });
  } catch (error) {
    console.error('Error updating notification configuration:', error);
    res.status(500).json({ error: 'Error updating notification configuration' });
  }
};