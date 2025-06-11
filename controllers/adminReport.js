import hana from '@sap/hana-client';
import dotenv from 'dotenv';
dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,  
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

//Crear un nuevo reporte
export function createReporte(reporte) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      const query = `
        INSERT INTO "BACKPYMEX"."Reporte"
        ("titulo", "descripcion", "urgencia", "fechaReporte", "resuelto", "detalleSolucion", "idUsuario", "idPyme")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        reporte.titulo,
        reporte.descripcion,
        reporte.urgencia,
        new Date(reporte.fechaReporte), 
        reporte.resuelto ? 1 : 0, 
        reporte.detalleSolucion,
        reporte.idUsuario,
        reporte.idPyme
      ];

      conn.exec(query, values, (err, result) => {
        conn.disconnect();
        if (err) {
          console.error('Error al crear el reporte:', err);
          return reject(err);
        }

        resolve({ message: "Reporte creado correctamente", data: result });
      });
    });
  });
}
//Obtener todos los reportes
export const getAllReportes = () => {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      conn.exec('SELECT * FROM "BACKPYMEX"."Reporte"', (err, rows) => {
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

//Actualizar el campo "resuelto" de un reporte por su ID 
export function updateResueltoReporte(idReporte, resuelto) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      const query = `
        UPDATE "BACKPYMEX"."Reporte"
        SET "resuelto" = ?
        WHERE "idReporte" = ?
      `;

      const values = [resuelto ? 1 : 0, idReporte];

      conn.exec(query, values, (err, result) => {
        conn.disconnect();
        if (err) {
          console.error('Error al actualizar el reporte:', err);
          return reject(err);
        }

        resolve({ message: "Reporte actualizado correctamente", data: result });
      });
    });
  });
} 

//Obtener reportes
export function getReporte(id) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      const query = `SELECT * FROM "BACKPYMEX"."Reporte" WHERE "idReporte" = ?`;

      conn.exec(query, [id], (err, rows) => {
        conn.disconnect();
        if (err) {
          console.error('Error al obtener el reporte:', err);
          return reject(err);
        }
        resolve(rows[0] || null);
      });
    });
  });
}

//Actualizar reportes
export function updateReporte(id, reporte) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
      if (err) {
        console.error('Error al conectar a SAP HANA:', err);
        return reject(err);
      }

      const query = `
        UPDATE "BACKPYMEX"."Reporte"
        SET "titulo" = ?, "descripcion" = ?, "prioridad" = ?, "resuelto" = ?, "fechaReporte" = ?
        WHERE "idReporte" = ?
      `;

      const values = [
        reporte.titulo,
        reporte.descripcion,
        reporte.prioridad,
        reporte.resuelto ? 1 : 0,
        new Date(reporte.fechaReporte),
        id
      ];

      conn.exec(query, values, (err, result) => {
        conn.disconnect();
        if (err) {
          console.error('Error al actualizar el reporte:', err);
          return reject(err);
        }
        resolve({ message: "Reporte actualizado correctamente", data: result });
      });
    });
  });
}
