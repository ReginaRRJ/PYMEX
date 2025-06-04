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

// Obtener todos los proveedores
async function getProveedores() {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `SELECT * FROM "BACKPYMEX"."Proveedor"`;
      conn.exec(query, (err, result) => {
        conn.disconnect();
        if (err) return reject("Error al obtener proveedores: " + err);
        resolve(result);
      });
    });
  });
}

// Obtener todos los productos
async function getProductoss() {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `SELECT * FROM "BACKPYMEX"."Producto"`;
      conn.exec(query, (err, result) => {
        conn.disconnect();
        if (err) return reject("Error al obtener proveedores: " + err);
        resolve(result);
      });
    });
  });
}

// sucursalPedidos.js
function getProductosPorProveedor(idProveedor) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `
        SELECT * 
        FROM "BACKPYMEX"."Producto" 
        WHERE "idProveedor" = ?
      `;
      conn.prepare(query, (err, statement) => {
        if (err) return reject("Error preparando query: " + err);
        statement.exec([idProveedor], (err, result) => {
          conn.disconnect();
          if (err) return reject("Error al obtener productos: " + err);
          resolve(result);
        });
      });
    });
  });
}

function crearPedido(pedidoData) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const {
        tipoPedido,
        cantidad,
        fechaCreacion,
        fechaEntregaEstimada,
        fechaEntrega,
        idProveedor,
        idProducto,
        idSucursal,
        idUsuario,
        estatusProveedor,
        estatusCliente
      } = pedidoData;

      const query = `
        INSERT INTO "BACKPYMEX"."Pedido" 
          (
            "tipoPedido", "cantidad", "fechaCreacion", "fechaEntregaEstimada", "fechaEntrega",
            "idProveedor", "idProducto", "idSucursal", "idUsuario",
            "estatusCliente", "estatusProveedor"
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          return reject("Error preparando query: " + err);
        }

        statement.exec([
          tipoPedido,
          cantidad,
          fechaCreacion,
          fechaEntregaEstimada,
          fechaEntrega,
          idProveedor,
          idProducto,
          idSucursal,
          idUsuario,
          estatusCliente,
          estatusProveedor
        ], (err, result) => {
          conn.disconnect();
          if (err) return reject("Error insertando pedido: " + err);
          resolve(result);
        });
      });
    });
  });
}

async function updatePedidoEstado(idPedido, nuevoEstado) {
  return new Promise((resolve, reject) => {
    const conn = hana.createConnection();
    conn.connect(connParams, (err) => {
      if (err) return reject("Error conectando a SAP HANA: " + err);

      const query = `
        UPDATE "BACKPYMEX"."Pedido"
        SET "estatusProveedor" = ?
        WHERE "idPedido" = ?
      `;

      conn.prepare(query, (err, statement) => {
        if (err) {
          conn.disconnect();
          return reject("Error preparando consulta: " + err);
        }

        statement.exec([nuevoEstado, idPedido], (err, result) => {
          statement.drop();
          conn.disconnect();
          if (err) return reject("Error ejecutando actualización: " + err);
          resolve(result);
        });
      });
    });
  });
}

export { getProveedores, getProductosPorProveedor, crearPedido, updatePedidoEstado, getProductoss };