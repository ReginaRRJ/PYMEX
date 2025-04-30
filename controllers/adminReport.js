import hana from '@sap/hana-client';
import dotenv from 'dotenv';
dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,  // Ejemplo: 'host:port'
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

// Obtener todos los reportes
export const getAllReportes = () => {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      conn.exec('SELECT * FROM "DBADMIN"."Reporte"', (err, rows) => {
        conn.disconnect();
        if (err) {
          console.error(' Error al obtener los reportes:', err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  });
};

// Update a Reporte en SAP HANA
export const updateReporte = (id, reporte) => {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      const query = `
        UPDATE "DBADMIN"."Reporte"
        SET 
          "titulo" = ?,
          "descripcion" = ?,
          "urgencia" = ?,
          "resuelto" = ?,
          "detalleSolucion" = ?,
          "fechaReporte" = ?,
          "fechaResolucion" = ?
        WHERE "idReporte" = ?
      `;

      const params = [
        reporte.titulo,
        reporte.descripcion,
        reporte.urgencia,
        reporte.resuelto ? 1 : 0, // HANA espera 1/0 para boolean
        reporte.detalleSolucion || '',
        new Date(reporte.fechaReporte),
        new Date(reporte.fechaResolucion),
        id
      ];

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          console.error('Error preparando la consulta:', err);
          return reject(err);
        }

        statement.exec(params, (err, rows) => {
          conn.disconnect();
          if (err) {
            console.error('Error ejecutando UPDATE:', err);
            return reject(err);
          }
          resolve(rows);
        });
      });
    });
  });
};

// Export the functions using ES Module export

