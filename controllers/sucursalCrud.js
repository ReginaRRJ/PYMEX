import connection from "../config/db.js"; 
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

export const getSucPedidos = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `SELECT * FROM "DBADMIN"."fn_pedidos_por_usuario"(?)`;
  const conn = hana.createConnection();

  try {
    await new Promise((resolve, reject) => {
      conn.connect(connParams, (err) => {
        if (err) {
          reject(new Error("Failed to connect to SAP HANA"));
        } else {
          resolve();
        }
      });
    });

    const stmt = await new Promise((resolve, reject) => {
      conn.prepare(query, (err, statement) => {
        if (err) reject(new Error(`Error preparing query: ${err.message}`));
        else resolve(statement);
      });
    });

    const rows = await new Promise((resolve, reject) => {
      stmt.exec([idUsuario], (err, result) => {
        if (err) reject(new Error(`Error executing query: ${err.message}`));
        else resolve(result);
      });
    });

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pedidos:", error.message);
    res.status(500).json({ error: "Error al obtener pedidos" });
  } finally {
    conn.disconnect((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
    });
  }
};
