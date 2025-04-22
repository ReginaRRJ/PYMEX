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
// Update a Reporte
async function updateReporte(id, reporte) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('titulo', sql.NVarChar, reporte.titulo)
            .input('descripcion', sql.NVarChar, reporte.descripcion)
            .input('urgencia', sql.NVarChar, reporte.urgencia)
            .input('resuelto', sql.Bit, reporte.resuelto)
            .input('detallesResolucion', sql.NVarChar, reporte.detallesResolucion)
            .input('fechaReporte', sql.DateTime, reporte.fechaReporte)
            .input('fechaResolucion', sql.DateTime, reporte.fechaResolucion)
            .query('UPDATE Reportes SET titulo = @titulo, descripcion = @descripcion, urgencia = @urgencia, resuelto = @resuelto, detallesResolucion = @detallesResolucion, fechaReporte = @fechaReporte, fechaResolucion = @fechaResolucion WHERE idReporte = @id');
        return result;
    } catch (error) {
        console.error('Error updating Reporte:', error);
        throw error;
    }
}

// Export the functions using ES Module export

