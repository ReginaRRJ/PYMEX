import hana from "@sap/hana-client";
import dotenv from "dotenv";

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
  encrypt: "true",
  sslValidateCertificate: "false"
};

// Obtener todos los usuarios
async function getUsuarios() {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `SELECT * FROM "DBADMIN"."Usuario"`;
      conn.exec(query, (err, result) => {
        conn.disconnect();
        if (err) return reject("Error al obtener usuarios: " + err);
        resolve(result);
      });
    });
  });
}

// Crear un nuevo usuario
async function createUsuario(usuario) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `
        INSERT INTO "DBADMIN"."Usuario" 
        ("nombreUsuario", "apellidoUsuario", "rol", "correo", "contrasena", "hashContrasena", "idPyme")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        usuario.nombreUsuario,
        usuario.apellidoUsuario,
        usuario.rol,
        usuario.correo,
        usuario.contrasena,
        Buffer.from(usuario.hashContrasena, 'hex'),
        usuario.idPyme
      ];

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          return reject("Error preparando la consulta: " + err);
        }

        statement.exec(values, (err, result) => {
          statement.drop();
          conn.disconnect();
          if (err) return reject("Error ejecutando inserción: " + err);
          resolve(result);
        });
      });
    });
  });
}

// Actualizar un usuario por ID
async function updateUsuario(id, usuario) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `
        UPDATE "DBADMIN"."Usuario"
        SET "nombreUsuario" = ?, 
            "apellidoUsuario" = ?, 
            "rol" = ?, 
            "correo" = ?, 
            "contrasena" = ?, 
            "hashContrasena" = ?, 
            "idPyme" = ?
        WHERE "idUsuario" = ?
      `;

      const values = [
        usuario.nombreUsuario,
        usuario.apellidoUsuario,
        usuario.rol,
        usuario.correo,
        usuario.contrasena,
        Buffer.from(usuario.hashContrasena || '', 'hex'),
        usuario.idPyme,
        id
      ];

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          return reject("Error preparando consulta de actualización: " + err);
        }

        statement.exec(values, (err, result) => {
          statement.drop();
          conn.disconnect();
          if (err) return reject("Error ejecutando actualización: " + err);
          resolve(result);
        });
      });
    });
  });
}

// Eliminar un usuario por ID
async function deleteUsuario(id) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `DELETE FROM "DBADMIN"."Usuario" WHERE "idUsuario" = ?`;

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          return reject("Error preparando consulta de borrado: " + err);
        }

        statement.exec([id], (err, result) => {
          statement.drop();
          conn.disconnect();
          if (err) return reject("Error ejecutando borrado: " + err);
          resolve(result);
        });
      });
    });
  });
}



export {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
};