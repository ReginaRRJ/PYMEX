import connection from "../config/db.js"; 
import hana from '@sap/hana-client';
import dotenv from 'dotenv';
// controllers/sucursalController.js
import { getProveedores as getProveedoresQuery, getProductosPorProveedor, crearPedido, updatePedidoEstado, getProductoss as getProductossQuery } from "./sucursalPedidos.js";
dotenv.config(); 

 
export async function getProductoss(req, res) {
  try {
    const productos = await getProductossQuery();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
}

export async function getProductos(req, res) {
  const { idProveedor } = req.params;
  try {
    const productos = await getProductosPorProveedor(idProveedor);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
}

export async function actualizarEstadoPedido(req, res) {
  const { idPedido } = req.params;
  const { nuevoEstado } = req.body;

  try {
    await updatePedidoEstado(idPedido, nuevoEstado);
    res.json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el pedido" });
  }
}

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

export const getSucPedidos = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `SELECT * FROM "BACKPYMEX"."fn_pedidos_por_usuario"(?)`;
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
        console.error('Error cerrando conexión:', err);
      }
    });
  }
};

export const getVentasAnualesPorSucursal = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `SELECT * FROM "BACKPYMEX"."fn_ventas_anuales_por_sucursal"(?)`;
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
    console.error("Error al obtener ventas anuales:", error.message);
    res.status(500).json({ error: "Error al obtener ventas anuales" });
  } finally {
    conn.disconnect((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
    });
  }
};

export const getVentasMensualesPorSucursal = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `SELECT * FROM "BACKPYMEX"."fn_ventas_mes_actual_por_sucursal"(?)`;
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
    console.error("Error al obtener ventas anuales:", error.message);
    res.status(500).json({ error: "Error al obtener ventas anuales" });
  } finally {
    conn.disconnect((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
    });
  }
};

export const getVentasSemanalesPorSucursal = async (req, res) => {
  const { idUsuario } = req.params;
  const query = `SELECT * FROM "BACKPYMEX"."fn_ventas_semana_actual_por_sucursal"(?)`;
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
    console.error("Error al obtener ventas anuales:", error.message);
    res.status(500).json({ error: "Error al obtener ventas anuales" });
  } finally {
    conn.disconnect((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
    });
  }
};

export const getStockPorProducto = async (req, res) => {
  const { idProducto, idSucursal } = req.params;
  const query = `SELECT * FROM "BACKPYMEX"."fn_stock_por_producto_y_sucursal"(?, ?)`;
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
      stmt.exec([idProducto, idSucursal], (err, result) => {  // ✅ Pasa ambos
        if (err) reject(new Error(`Error executing query: ${err.message}`));
        else resolve(result);
      });
    });

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener stock:", error.message);
    res.status(500).json({ error: "Error al obtener stock" });
  } finally {
    conn.disconnect((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
    });
  }
};
 
export async function getProveedores(req, res) {
  try {
    const proveedores = await getProveedoresQuery();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
}


export async function postCrearPedido(req, res) {
  try {
    const pedidoData = req.body;

    if (
      !pedidoData.tipoPedido ||
      !pedidoData.cantidad ||
      !pedidoData.fechaCreacion ||
      !pedidoData.fechaEntregaEstimada ||
      !pedidoData.fechaEntrega ||
      !pedidoData.idProveedor ||
      !pedidoData.idProducto ||
      !pedidoData.idSucursal
    ) {
      return res.status(400).json({ message: "Faltan datos en la solicitud" });
    }

    await crearPedido(pedidoData);
    res.status(201).json({ message: "Pedido creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
}