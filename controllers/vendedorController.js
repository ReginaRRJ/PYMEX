// controllers/clientVentasCrud.js
import hana from "@sap/hana-client";
import dotenv from "dotenv";

dotenv.config();

// Define base connection parameters
const baseConnParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
};

export const getSucursalesByPymeService = async (req, res) => {
  const { idPyme } = req.params;
  console.log("🔍 idPyme recibido:", idPyme);

  const query = `
    SELECT "idSucursal", "nombreSucursal", "ubicacionSucursal"
    FROM "BACKPYMEX"."Sucursal"
    WHERE "idPyme" = ?;
  `;

  const conn = hana.createConnection();

  conn.connect(baseConnParams, (err) => {
    // 👈 aquí usamos baseConnParams
    if (err) {
      console.error("❌ Error conectando a SAP HANA:", err);
      return res
        .status(500)
        .json({ error: "Error al conectar a la base de datos" });
    }

    conn.prepare(query, (err, stmt) => {
      if (err) {
        console.error("❌ Error preparando consulta:", err);
        conn.disconnect();
        return res.status(500).json({ error: "Error preparando consulta" });
      }

      stmt.exec([idPyme], (err, rows) => {
        conn.disconnect();

        if (err) {
          console.error("❌ Error ejecutando consulta:", err);
          return res.status(500).json({ error: "Error ejecutando consulta" });
        }

        console.log("✅ Sucursales encontradas:", rows);
        res.json(rows);
      });
    });
  });
};

// This helper function `executeHanaQuery` is not used in createTicket
// so it's not directly related to this error.
const executeHanaQuery = (query, params, res, successCallback) => {
  const conn = hana.createConnection();
  conn.connect(baseConnParams, (connectErr) => {
    // Use baseConnParams for auto-commit true scenarios
    if (connectErr) {
      console.error("Error connecting to SAP HANA:", connectErr);
      return res.status(500).json({ error: "Database connection failed." });
    }

    conn.prepare(query, (prepareErr, stmt) => {
      if (prepareErr) {
        console.error("Error preparing statement:", prepareErr);
        conn.disconnect();
        return res
          .status(500)
          .json({ error: "Failed to prepare database statement." });
      }

      stmt.exec(params, (execErr, result) => {
        if (execErr) {
          console.error("Error executing statement:", execErr);
          stmt.drop();
          conn.disconnect();
          return res
            .status(500)
            .json({ error: "Failed to execute database statement." });
        }

        successCallback(result, stmt, conn);
      });
    });
  });
};

export const getProductsByBranch = async (req, res) => {
  const { idSucursal } = req.params;
  console.log(`Working on products for idSucursal: ${idSucursal}`);

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
    console.log(`Found ${rows.length} products for idSucursal ${idSucursal}.`);
    res.status(200).json(rows);
    stmt.drop();
    conn.disconnect();
  });
};

export const createTicket = async (req, res) => {
  const { idSucursal, product, cantidad } = req.body;
  console.log(
    `Creating ticket for idSucursal: ${idSucursal}, product: ${product.nombreProductoo}, quantity: ${cantidad}`
  );

  if (
    !idSucursal ||
    !product ||
    !product.idProducto ||
    !product.precio ||
    !cantidad ||
    cantidad <= 0
  ) {
    return res.status(400).json({ error: "Missing or invalid ticket data." });
  }

  // Define connection parameters for this transaction, with autoCommit set to false
  const transactionConnParams = {
    ...baseConnParams, // Inherit base parameters
    autoCommit: false, // Crucial: Disable auto-commit for explicit transactions
  };

  const conn = hana.createConnection();
  conn.connect(transactionConnParams, async (connectErr) => {
    // Use transaction-specific parameters
    if (connectErr) {
      console.error("Connection failed for ticket creation:", connectErr);
      return res
        .status(500)
        .json({ error: "Database connection failed for ticket creation." });
    }

    try {
      console.log("Transaction started (auto-commit OFF).");

      // --- 1. Check Availability ---
      const checkAvailabilityQuery = `
        SELECT "cantidadProducto" FROM "BACKPYMEX"."Almacenamiento"
        WHERE "idProducto" = ? AND "idSucursal" = ?;
      `;
      const checkRows = await new Promise((resolve, reject) => {
        conn.prepare(checkAvailabilityQuery, (checkPrepErr, checkStmt) => {
          if (checkPrepErr) return reject(checkPrepErr);
          checkStmt.exec(
            [product.idProducto, idSucursal],
            (checkExecErr, result) => {
              checkStmt.drop();
              if (checkExecErr) return reject(checkExecErr);
              resolve(result);
            }
          );
        });
      });

      if (checkRows.length === 0) {
        console.warn(
          `Product idProducto ${product.idProducto} not found in Almacenamiento for idSucursal ${idSucursal}.`
        );
        await new Promise((r) => conn.exec("ROLLBACK", r)); // Rollback on not found
        conn.disconnect();
        return res
          .status(404)
          .json({ error: "Product not found in this branch's inventory." });
      }

      const availableQuantity = checkRows[0].cantidadProducto;
      if (availableQuantity < cantidad) {
        console.warn(
          `Insufficient stock for idProducto ${product.idProducto} at idSucursal ${idSucursal}. Available: ${availableQuantity}, Requested: ${cantidad}`
        );
        await new Promise((r) => conn.exec("ROLLBACK", r)); // Rollback on insufficient stock
        conn.disconnect();
        return res
          .status(400)
          .json({
            error: `Insufficient product quantity. Only ${availableQuantity} available.`,
          });
      }

      // --- 2. Insert Ticket ---
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

      // --- 3. Get Last Inserted Ticket ID ---
      const idRows = await new Promise((resolve, reject) => {
        conn.exec(
          'SELECT CURRENT_IDENTITY_VALUE() AS "idTicket" FROM DUMMY;',
          (idErr, result) => {
            if (idErr) return reject(idErr);
            resolve(result);
          }
        );
      });

      if (!idRows || idRows.length === 0) {
        throw new Error("Failed to get last inserted ticket ID.");
      }
      const newTicketId = idRows[0].idTicket;

      // --- 4. Insert Ticket_Producto ---
      const insertTicketProductQuery = `
        INSERT INTO "BACKPYMEX"."Ticket_Producto" ("cantidad", "idTicket", "idProducto")
        VALUES (?, ?, ?);
      `;
      await new Promise((resolve, reject) => {
        conn.prepare(insertTicketProductQuery, (tpPrepErr, tpStmt) => {
          if (tpPrepErr) return reject(tpPrepErr);
          tpStmt.exec(
            [cantidad, newTicketId, product.idProducto],
            (tpExecErr, result) => {
              tpStmt.drop();
              if (tpExecErr) return reject(tpExecErr);
              resolve(result);
            }
          );
        });
      });

      // --- 5. Update Almacenamiento ---
      const updateAlmacenamientoQuery = `
        UPDATE "BACKPYMEX"."Almacenamiento"
        SET "cantidadProducto" = "cantidadProducto" - ?
        WHERE "idProducto" = ? AND "idSucursal" = ?;
      `;
      await new Promise((resolve, reject) => {
        conn.prepare(updateAlmacenamientoQuery, (almPrepErr, almStmt) => {
          if (almPrepErr) return reject(almPrepErr);
          almStmt.exec(
            [cantidad, product.idProducto, idSucursal],
            (almExecErr, result) => {
              almStmt.drop();
              if (almExecErr) return reject(almExecErr);
              resolve(result);
            }
          );
        });
      });

      // --- COMMIT TRANSACTION ---
      await new Promise((resolve, reject) => {
        conn.exec("COMMIT", (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log(
        `Ticket ${newTicketId} created successfully for idSucursal ${idSucursal}. Inventory updated.`
      );
      res
        .status(201)
        .json({
          message: "Ticket created successfully",
          idTicket: newTicketId,
        });
    } catch (error) {
      console.error("Transaction failed:", error);
      // --- ROLLBACK TRANSACTION ---
      await new Promise((r) => conn.exec("ROLLBACK", r)); // Ensure rollback happens
      res
        .status(500)
        .json({ error: `Transaction failed: ${error.message || error}` });
    } finally {
      // Ensure connection is always disconnected
      conn.disconnect();
    }
  });
};

export const getTicketsByBranch = async (req, res) => {
  const { idSucursal } = req.params;
  console.log(`Working on tickets for idSucursal: ${idSucursal}`);

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

    rows.forEach((row) => {
      if (!ticketsMap.has(row.idTicket)) {
        ticketsMap.set(row.idTicket, {
          idTicket: row.idTicket,
          fechaVenta: row.fechaVenta,
          products: [],
          totalImporte: 0,
          totalQuantity: 0,
        });
      }
      const ticket = ticketsMap.get(row.idTicket);
      // Ensure these are numbers before multiplication
      const cantidad =
        typeof row.cantidad === "number"
          ? row.cantidad
          : parseFloat(row.cantidad) || 0;
      const precioProducto =
        typeof row.precioProducto === "number"
          ? row.precioProducto
          : parseFloat(row.precioProducto) || 0;

      const itemImporte = cantidad * precioProducto;

      ticket.products.push({
        productName: row.productName,
        cantidad: cantidad,
        pricePerUnit: precioProducto,
        itemImporte: itemImporte,
      });
      ticket.totalImporte += itemImporte;
      ticket.totalQuantity += cantidad;
    });

    const formattedTickets = Array.from(ticketsMap.values()).map((ticket) => ({
      idTicket: ticket.idTicket,
      fechaVenta: ticket.fechaVenta,
      products: ticket.products,
      totalImporte: ticket.totalImporte.toFixed(2),
      cantidadTotal: ticket.totalQuantity,
    }));

    console.log(
      `Found ${formattedTickets.length} formatted tickets for idSucursal ${idSucursal}.`
    );
    res.status(200).json(formattedTickets);
    stmt.drop();
    conn.disconnect();
  });
};
// // controllers/clientVentasCrud.js
// import hana from "@sap/hana-client";
// import dotenv from "dotenv";

// dotenv.config();

// // Define base connection parameters
// const baseConnParams = {
//   serverNode: process.env.DB_HOST,
//   uid: process.env.DB_USER,
//   pwd: process.env.DB_PASSWORD,
// };

// export const getSucursalesByPymeService = async (req, res) => {
//   const { idPyme } = req.params;
//   console.log("🔍 idPyme recibido:", idPyme);

//   const query = `
//     SELECT "idSucursal", "nombreSucursal", "ubicacionSucursal"
//     FROM "BACKPYMEX"."Sucursal"
//     WHERE "idPyme" = ?;
//   `;

//   const conn = hana.createConnection();

//   conn.connect(baseConnParams, (err) => {
//     // 👈 aquí usamos baseConnParams
//     if (err) {
//       console.error("Error conectando a SAP HANA:", err);
//       return res
//         .status(500)
//         .json({ error: "Error al conectar a la base de datos" });
//     }

//     conn.prepare(query, (err, stmt) => {
//       if (err) {
//         console.error("Error preparando consulta:", err);
//         conn.disconnect();
//         return res.status(500).json({ error: "Error preparando consulta" });
//       }

//       stmt.exec([idPyme], (err, rows) => {
//         conn.disconnect();

//         if (err) {
//           console.error("Error ejecutando consulta:", err);
//           return res.status(500).json({ error: "Error ejecutando consulta" });
//         }

//         console.log("Sucursales encontradas:", rows);
//         res.json(rows);
//       });
//     });
//   });
// };

// // This helper function `executeHanaQuery` is not used in createTicket
// // so it's not directly related to this error.
// const executeHanaQuery = (query, params, res, successCallback) => {
//   const conn = hana.createConnection();
//   conn.connect(baseConnParams, (connectErr) => {
//     // Use baseConnParams for auto-commit true scenarios
//     if (connectErr) {
//       console.error("Error connecting to SAP HANA:", connectErr);
//       return res.status(500).json({ error: "Database connection failed." });
//     }

//     conn.prepare(query, (prepareErr, stmt) => {
//       if (prepareErr) {
//         console.error("Error preparing statement:", prepareErr);
//         conn.disconnect();
//         return res
//           .status(500)
//           .json({ error: "Failed to prepare database statement." });
//       }

//       stmt.exec(params, (execErr, result) => {
//         if (execErr) {
//           console.error("Error executing statement:", execErr);
//           stmt.drop();
//           conn.disconnect();
//           return res
//             .status(500)
//             .json({ error: "Failed to execute database statement." });
//         }

//         successCallback(result, stmt, conn);
//       });
//     });
//   });
// };

// export const getProductsByBranch = async (req, res) => {
//   const { idSucursal } = req.params;
//   console.log(`Working on products for idSucursal: ${idSucursal}`);

//   const query = `
//     SELECT
//       P."idProducto",
//       P."nombreProductoo",
//       P."precioProducto",
//       A."cantidadProducto" AS "availableQuantity"
//     FROM "BACKPYMEX"."Producto" AS P
//     JOIN "BACKPYMEX"."Almacenamiento" AS A
//       ON P."idProducto" = A."idProducto"
//     WHERE A."idSucursal" = ?;
//   `;

//   executeHanaQuery(query, [idSucursal], res, (rows, stmt, conn) => {
//     console.log(`Found ${rows.length} products for idSucursal ${idSucursal}.`);
//     res.status(200).json(rows);
//     stmt.drop();
//     conn.disconnect();
//   });
// };

// export const createTicket = async (req, res) => {
//   const { idSucursal, product, cantidad } = req.body;
//   console.log(
//     `Creating ticket for idSucursal: ${idSucursal}, product: ${product.nombreProductoo}, quantity: ${cantidad}`
//   );

//   if (
//     !idSucursal ||
//     !product ||
//     !product.idProducto ||
//     !product.precio ||
//     !cantidad ||
//     cantidad <= 0
//   ) {
//     return res.status(400).json({ error: "Missing or invalid ticket data." });
//   }

//   // Define connection parameters for this transaction, with autoCommit set to false
//   const transactionConnParams = {
//     ...baseConnParams, // Inherit base parameters
//     autoCommit: false, // Crucial: Disable auto-commit for explicit transactions
//   };

//   const conn = hana.createConnection();
//   conn.connect(transactionConnParams, async (connectErr) => {
//     // Use transaction-specific parameters
//     if (connectErr) {
//       console.error("Connection failed for ticket creation:", connectErr);
//       return res
//         .status(500)
//         .json({ error: "Database connection failed for ticket creation." });
//     }

//     try {
//       console.log("Transaction started (auto-commit OFF).");

//       // --- 1. Check Availability ---
//       const checkAvailabilityQuery = `
//         SELECT "cantidadProducto" FROM "BACKPYMEX"."Almacenamiento"
//         WHERE "idProducto" = ? AND "idSucursal" = ?;
//       `;
//       const checkRows = await new Promise((resolve, reject) => {
//         conn.prepare(checkAvailabilityQuery, (checkPrepErr, checkStmt) => {
//           if (checkPrepErr) return reject(checkPrepErr);
//           checkStmt.exec(
//             [product.idProducto, idSucursal],
//             (checkExecErr, result) => {
//               checkStmt.drop();
//               if (checkExecErr) return reject(checkExecErr);
//               resolve(result);
//             }
//           );
//         });
//       });

//       if (checkRows.length === 0) {
//         console.warn(
//           `Product idProducto ${product.idProducto} not found in Almacenamiento for idSucursal ${idSucursal}.`
//         );
//         await new Promise((r) => conn.exec("ROLLBACK", r)); // Rollback on not found
//         conn.disconnect();
//         return res
//           .status(404)
//           .json({ error: "Product not found in this branch's inventory." });
//       }

//       const availableQuantity = checkRows[0].cantidadProducto;
//       if (availableQuantity < cantidad) {
//         console.warn(
//           `Insufficient stock for idProducto ${product.idProducto} at idSucursal ${idSucursal}. Available: ${availableQuantity}, Requested: ${cantidad}`
//         );
//         await new Promise((r) => conn.exec("ROLLBACK", r)); // Rollback on insufficient stock
//         conn.disconnect();
//         return res
//           .status(400)
//           .json({
//             error: `Insufficient product quantity. Only ${availableQuantity} available.`,
//           });
//       }

//       // --- 2. Insert Ticket ---
//       const insertTicketQuery = `
//         INSERT INTO "BACKPYMEX"."Ticket" ("fechaVenta", "cantidadTotal", "idSucursal")
//         VALUES (CURRENT_DATE, ?, ?);
//       `;
//       await new Promise((resolve, reject) => {
//         conn.prepare(insertTicketQuery, (ticketPrepErr, ticketStmt) => {
//           if (ticketPrepErr) return reject(ticketPrepErr);
//           ticketStmt.exec([cantidad, idSucursal], (ticketExecErr, result) => {
//             ticketStmt.drop();
//             if (ticketExecErr) return reject(ticketExecErr);
//             resolve(result);
//           });
//         });
//       });

//       // --- 3. Get Last Inserted Ticket ID ---
//       const idRows = await new Promise((resolve, reject) => {
//         conn.exec(
//           'SELECT CURRENT_IDENTITY_VALUE() AS "idTicket" FROM DUMMY;',
//           (idErr, result) => {
//             if (idErr) return reject(idErr);
//             resolve(result);
//           }
//         );
//       });

//       if (!idRows || idRows.length === 0) {
//         throw new Error("Failed to get last inserted ticket ID.");
//       }
//       const newTicketId = idRows[0].idTicket;

//       // --- 4. Insert Ticket_Producto ---
//       const insertTicketProductQuery = `
//         INSERT INTO "BACKPYMEX"."Ticket_Producto" ("cantidad", "idTicket", "idProducto")
//         VALUES (?, ?, ?);
//       `;
//       await new Promise((resolve, reject) => {
//         conn.prepare(insertTicketProductQuery, (tpPrepErr, tpStmt) => {
//           if (tpPrepErr) return reject(tpPrepErr);
//           tpStmt.exec(
//             [cantidad, newTicketId, product.idProducto],
//             (tpExecErr, result) => {
//               tpStmt.drop();
//               if (tpExecErr) return reject(tpExecErr);
//               resolve(result);
//             }
//           );
//         });
//       });

//       // --- 5. Update Almacenamiento ---
//       const updateAlmacenamientoQuery = `
//         UPDATE "BACKPYMEX"."Almacenamiento"
//         SET "cantidadProducto" = "cantidadProducto" - ?
//         WHERE "idProducto" = ? AND "idSucursal" = ?;
//       `;
//       await new Promise((resolve, reject) => {
//         conn.prepare(updateAlmacenamientoQuery, (almPrepErr, almStmt) => {
//           if (almPrepErr) return reject(almPrepErr);
//           almStmt.exec(
//             [cantidad, product.idProducto, idSucursal],
//             (almExecErr, result) => {
//               almStmt.drop();
//               if (almExecErr) return reject(almExecErr);
//               resolve(result);
//             }
//           );
//         });
//       });

//       // --- COMMIT TRANSACTION ---
//       await new Promise((resolve, reject) => {
//         conn.exec("COMMIT", (err) => {
//           if (err) return reject(err);
//           resolve();
//         });
//       });
//       console.log(
//         `Ticket ${newTicketId} created successfully for idSucursal ${idSucursal}. Inventory updated.`
//       );
//       res
//         .status(201)
//         .json({
//           message: "Ticket created successfully",
//           idTicket: newTicketId,
//         });
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       // --- ROLLBACK TRANSACTION ---
//       await new Promise((r) => conn.exec("ROLLBACK", r)); // Ensure rollback happens
//       res
//         .status(500)
//         .json({ error: `Transaction failed: ${error.message || error}` });
//     } finally {
//       // Ensure connection is always disconnected
//       conn.disconnect();
//     }
//   });
// };

// export const getTicketsByBranch = async (req, res) => {
//   const { idSucursal } = req.params;
//   console.log(`Working on tickets for idSucursal: ${idSucursal}`);

//   const query = `
//     SELECT
//       T."idTicket",
//       TO_NVARCHAR(T."fechaVenta", 'YYYY-MM-DD') AS "fechaVenta",
//       COALESCE(TP."cantidad", 0) AS "cantidad",
//       P."nombreProductoo" AS "productName",
//       COALESCE(P."precioProducto", 0.00) AS "precioProducto"
//     FROM "BACKPYMEX"."Ticket" AS T
//     JOIN "BACKPYMEX"."Ticket_Producto" AS TP
//       ON T."idTicket" = TP."idTicket"
//     JOIN "BACKPYMEX"."Producto" AS P
//       ON TP."idProducto" = P."idProducto"
//     WHERE T."idSucursal" = ?
//     ORDER BY T."fechaVenta" DESC, T."idTicket" DESC;
//   `;

//   executeHanaQuery(query, [idSucursal], res, (rows, stmt, conn) => {
//     const ticketsMap = new Map();

//     rows.forEach((row) => {
//       if (!ticketsMap.has(row.idTicket)) {
//         ticketsMap.set(row.idTicket, {
//           idTicket: row.idTicket,
//           fechaVenta: row.fechaVenta,
//           products: [],
//           totalImporte: 0,
//           totalQuantity: 0,
//         });
//       }
//       const ticket = ticketsMap.get(row.idTicket);
//       // Ensure these are numbers before multiplication
//       const cantidad =
//         typeof row.cantidad === "number"
//           ? row.cantidad
//           : parseFloat(row.cantidad) || 0;
//       const precioProducto =
//         typeof row.precioProducto === "number"
//           ? row.precioProducto
//           : parseFloat(row.precioProducto) || 0;

//       const itemImporte = cantidad * precioProducto;

//       ticket.products.push({
//         productName: row.productName,
//         cantidad: cantidad,
//         pricePerUnit: precioProducto,
//         itemImporte: itemImporte,
//       });
//       ticket.totalImporte += itemImporte;
//       ticket.totalQuantity += cantidad;
//     });

//     const formattedTickets = Array.from(ticketsMap.values()).map((ticket) => ({
//       idTicket: ticket.idTicket,
//       fechaVenta: ticket.fechaVenta,
//       products: ticket.products,
//       totalImporte: ticket.totalImporte.toFixed(2),
//       cantidadTotal: ticket.totalQuantity,
//     }));

//     console.log(
//       `Found ${formattedTickets.length} formatted tickets for idSucursal ${idSucursal}.`
//     );
//     res.status(200).json(formattedTickets);
//     stmt.drop();
//     conn.disconnect();
//   });
// };
