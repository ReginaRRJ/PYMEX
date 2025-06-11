import hana from "@sap/hana-client";
import dotenv from 'dotenv';

dotenv.config();

const baseConnParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

//Obtener sucursales por PYME
export const getSucursalesByPymeService = async (req, res) => {
  const { idPyme } = req.params;

  const query = `
    SELECT "idSucursal", "nombreSucursal", "ubicacionSucursal"
    FROM "BACKPYMEX"."Sucursal"
    WHERE "idPyme" = ?;
  `;

  const conn = hana.createConnection();

  conn.connect(baseConnParams, (err) => {  
    if (err) {
      console.error("Error conectando a SAP HANA:", err);
      return res
        .status(500)
        .json({ error: "Error al conectar a la base de datos" });
    }

    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error("Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ error: "Error preparando consulta" });
      }

      stmt.exec([idPyme], (err, rows) => {
        conn.disconnect();

        if (err) {
          console.error("Error ejecutando consulta:", err);
          return res.status(500).json({ error: "Error ejecutando consulta" });
        }

        res.json(rows);
      });
    });
  });
};


const executeHanaQuery = (query, params, res, successCallback) => {
  const conn = hana.createConnection();
  conn.connect(baseConnParams, (connectErr) => { 
    if (connectErr) {
      console.error('Error conectando a SAP HANA:', connectErr);
      return res.status(500).json({ error: 'Conexión con base de datos fallida.' });
    }

    conn.prepare(query, (prepareErr, stmt) => {
      if (prepareErr) {
        console.error('Error preparando sentencia:', prepareErr);
        conn.disconnect();
        return res.status(500).json({ error: 'Error preparando sentencia de base de datos.' });
      }

      stmt.exec(params, (execErr, result) => {
        if (execErr) {
          console.error('Error ejecutando sentencia:', execErr);
          stmt.drop();
          conn.disconnect();
          return res.status(500).json({ error: 'Error ejecutando sentencia de base de datos.' });
        }

        successCallback(result, stmt, conn);
      });
    });
  });
};

//Obtener productos por sucursal
export const getProductsByBranch = async (req, res) => {
  const { idSucursal } = req.params;

  const query = `
    SELECT
      P."idProducto",
      P."nombreProductoo",
      P."precioProducto",
      A."cantidadProducto" AS "availableQuantity"
    FROM "BACKPYMEX"."Producto" AS P
    JOIN "BACKPYMEX"."Almacenamiento" AS A
      ON P."idProducto" = A."idProducto"
    WHERE A."idSucursal" = ?;
  `;

  executeHanaQuery(query, [idSucursal], res, (rows, stmt, conn) => {
    res.status(200).json(rows);
    stmt.drop();
    conn.disconnect();
  });
};

//Crear ticket
export const createTicket = async (req, res) => {
  const { idSucursal, product, cantidad } = req.body;
  
  if (!idSucursal || !product || !product.idProducto || !product.precio || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'Información de ticket faltante o inválida.' });
  }

  const transactionConnParams = {
    ...baseConnParams, 
    autoCommit: false   
  };

  const conn = hana.createConnection();
  conn.connect(transactionConnParams, async (connectErr) => { 
    if (connectErr) {
      console.error('Conexión fallida para creación de ticket:', connectErr);
      return res.status(500).json({ error: 'Conexión a base de datos fallida para creación de ticket.' });
    }

    try {
      
      const checkAvailabilityQuery = `
        SELECT "cantidadProducto" FROM "BACKPYMEX"."Almacenamiento"
        WHERE "idProducto" = ? AND "idSucursal" = ?;
      `;
      const checkRows = await new Promise((resolve, reject) => {
        conn.prepare(checkAvailabilityQuery, (checkPrepErr, checkStmt) => {
          if (checkPrepErr) return reject(checkPrepErr);
          checkStmt.exec([product.idProducto, idSucursal], (checkExecErr, result) => {
            checkStmt.drop();
            if (checkExecErr) return reject(checkExecErr);
            resolve(result);
          });
        });
      });

      if (checkRows.length === 0) {
        console.warn(`Producto ${product.idProducto} not encontrado en almacenamiento para sucursal ${idSucursal}.`);
        await new Promise(r => conn.exec('ROLLBACK', r)); 
        conn.disconnect();
        return res.status(404).json({ error: 'Producto no encontrado en la sucursal.' });
      }

      const availableQuantity = checkRows[0].cantidadProducto;
      if (availableQuantity < cantidad) {
        console.warn(`Almacenamiento no suficiente para  ${product.idProducto} en sucursal ${idSucursal}. Disponible: ${availableQuantity}, Requerido: ${cantidad}`);
        await new Promise(r => conn.exec('ROLLBACK', r)); 
        conn.disconnect();
        return res.status(400).json({ error: `Cantidad de producto insuficiente. Sólo ${availableQuantity} dispinibles.` });
      }

 
      const insertTicketQuery = `
        INSERT INTO "BACKPYMEX"."Ticket" ("fechaVenta", "cantidadTotal", "idSucursal")
        VALUES (CURRENT_DATE, ?, ?);
      `;
      await new Promise((resolve, reject) => {
        conn.prepare(insertTicketQuery, (ticketPrepErr, ticketStmt) => {
          if (ticketPrepErr) return reject(ticketPrepErr);
          ticketStmt.exec([cantidad, idSucursal], (ticketExecErr, result) => {
            ticketStmt.drop();
            if (ticketExecErr) return reject(ticketExecErr);
            resolve(result);
          });
        });
      });

      const idRows = await new Promise((resolve, reject) => {
        conn.exec('SELECT CURRENT_IDENTITY_VALUE() AS "idTicket" FROM DUMMY;', (idErr, result) => {
          if (idErr) return reject(idErr);
          resolve(result);
        });
      });

      if (!idRows || idRows.length === 0) {
        throw new Error('Failed to get last inserted ticket ID.');
      }
      const newTicketId = idRows[0].idTicket;

      const insertTicketProductQuery = `
        INSERT INTO "BACKPYMEX"."Ticket_Producto" ("cantidad", "idTicket", "idProducto")
        VALUES (?, ?, ?);
      `;
      await new Promise((resolve, reject) => {
        conn.prepare(insertTicketProductQuery, (tpPrepErr, tpStmt) => {
          if (tpPrepErr) return reject(tpPrepErr);
          tpStmt.exec([cantidad, newTicketId, product.idProducto], (tpExecErr, result) => {
            tpStmt.drop();
            if (tpExecErr) return reject(tpExecErr);
            resolve(result);
          });
        });
      });

      const updateAlmacenamientoQuery = `
        UPDATE "BACKPYMEX"."Almacenamiento"
        SET "cantidadProducto" = "cantidadProducto" - ?
        WHERE "idProducto" = ? AND "idSucursal" = ?;
      `;
      await new Promise((resolve, reject) => {
        conn.prepare(updateAlmacenamientoQuery, (almPrepErr, almStmt) => {
          if (almPrepErr) return reject(almPrepErr);
          almStmt.exec([cantidad, product.idProducto, idSucursal], (almExecErr, result) => {
            almStmt.drop();
            if (almExecErr) return reject(almExecErr);
            resolve(result);
          });
        });
      });

      await new Promise((resolve, reject) => {
        conn.exec('COMMIT', (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log(`Ticket ${newTicketId} creado para sucursal ${idSucursal}. Inventario actualizado.`);
      res.status(201).json({ message: 'Ticket creado exitosamente', idTicket: newTicketId });

    } catch (error) {
      console.error('Transacción fallida:', error);
     
      await new Promise(r => conn.exec('ROLLBACK', r)); 
      res.status(500).json({ error: `Transacción fallida: ${error.message || error}` });
    } finally {
      conn.disconnect();
    }
  });
};

//Obtener todos los tickets de las sucursales 
export const getTicketsByBranch = async (req, res) => {
  const { idSucursal } = req.params;

  const query = `
    SELECT
      T."idTicket",
      TO_NVARCHAR(T."fechaVenta", 'YYYY-MM-DD') AS "fechaVenta",
      COALESCE(TP."cantidad", 0) AS "cantidad",
      P."nombreProductoo" AS "productName",
      COALESCE(P."precioProducto", 0.00) AS "precioProducto"
    FROM "BACKPYMEX"."Ticket" AS T
    JOIN "BACKPYMEX"."Ticket_Producto" AS TP
      ON T."idTicket" = TP."idTicket"
    JOIN "BACKPYMEX"."Producto" AS P
      ON TP."idProducto" = P."idProducto"
    WHERE T."idSucursal" = ?
    ORDER BY T."fechaVenta" DESC, T."idTicket" DESC;
  `;

  executeHanaQuery(query, [idSucursal], res, (rows, stmt, conn) => {
    const ticketsMap = new Map();

    rows.forEach(row => {
      if (!ticketsMap.has(row.idTicket)) {
        ticketsMap.set(row.idTicket, {
          idTicket: row.idTicket,
          fechaVenta: row.fechaVenta,
          products: [],
          totalImporte: 0,
          totalQuantity: 0
        });
      }
      const ticket = ticketsMap.get(row.idTicket);
      const cantidad = typeof row.cantidad === 'number' ? row.cantidad : parseFloat(row.cantidad) || 0;
      const precioProducto = typeof row.precioProducto === 'number' ? row.precioProducto : parseFloat(row.precioProducto) || 0;

      const itemImporte = cantidad * precioProducto;

      ticket.products.push({
        productName: row.productName,
        cantidad: cantidad,
        pricePerUnit: precioProducto,
        itemImporte: itemImporte
      });
      ticket.totalImporte += itemImporte;
      ticket.totalQuantity += cantidad;
    });

    const formattedTickets = Array.from(ticketsMap.values()).map(ticket => ({
        idTicket: ticket.idTicket,
        fechaVenta: ticket.fechaVenta,
        products: ticket.products,
        totalImporte: ticket.totalImporte.toFixed(2),
        cantidadTotal: ticket.totalQuantity
    }));

    res.status(200).json(formattedTickets);
    stmt.drop();
    conn.disconnect();
  });
};

//Obtener información de ventas
export const getSalesData = (req, res) => {
    const { idPyme } = req.params;

    if (!idPyme) {
        return res.status(400).send("idPyme requerida.");
    }

    const conn = hana.createConnection();

    conn.connect(baseConnParams, (err) => {
        if (err) {
            console.error("Error al conectar a SAP HANA:", err);
            return res.status(500).send("Error conectando a SAP HANA");
        }

        console.log("Conectado a SAP HANA Cloud");

        const sqlQuery = `
SELECT
    T."idTicket",
    T."fechaVenta",
    T."cantidadTotal",
    S."nombreSucursal",
    COALESCE(ProductAgg.productosVendidos, 'No products') AS productosVendidos,
    COALESCE(ProductAgg.totalTicketPrice, 0.00) AS totalTicketPrice
FROM
    "BACKPYMEX"."Ticket" AS T 
JOIN
    "BACKPYMEX"."Sucursal" AS S ON T."idSucursal" = S."idSucursal" 
JOIN
    "BACKPYMEX"."Pyme" AS PY ON S."idPyme" = PY."idPyme" 
LEFT JOIN (
    SELECT
        TP."idTicket",
        STRING_AGG(
            COALESCE(P."nombreProductoo", 'Desconocido') || ' (' || COALESCE(TP."cantidad", 0) || ')',
            ', '
        ) AS productosVendidos,
        SUM(COALESCE(TP."cantidad", 0) * COALESCE(P."precioProducto", 0)) AS totalTicketPrice
    FROM
        "BACKPYMEX"."Ticket_Producto" AS TP 
    JOIN
        "BACKPYMEX"."Producto" AS P ON TP."idProducto" = P."idProducto" 
    GROUP BY
        TP."idTicket"
) AS ProductAgg ON T."idTicket" = ProductAgg."idTicket"
WHERE
    PY."idPyme" = ?
ORDER BY
    T."fechaVenta" DESC;
        `;

        conn.prepare(sqlQuery, (err, statement) => {
            if (err) {
                console.error("Error preparando consulta de ventas:", err);
                conn.disconnect();
                return res.status(500).send("Error preparando la consulta de ventas");
            }

            statement.exec([idPyme], (err, results) => {
                if (err) {
                    console.error("Error ejecutando consulta de ventas:", err);
                    statement.drop();
                    conn.disconnect();
                    return res.status(500).send("Error ejecutando la consulta de ventas");
                }

                statement.drop();
                conn.disconnect();
                return res.status(200).json(results);
            });
        });
    });
};
