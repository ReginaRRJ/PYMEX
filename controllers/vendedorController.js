import hana from "@sap/hana-client";
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

const executeHanaQuery = (query, params, res, successCallback) => {
  const conn = hana.createConnection();
  conn.connect(connParams, (connectErr) => {
    if (connectErr) {
      console.error('Error connecting to SAP HANA:', connectErr);
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    conn.prepare(query, (prepareErr, stmt) => {
      if (prepareErr) {
        console.error('Error preparing statement:', prepareErr);
        conn.disconnect();
        return res.status(500).json({ error: 'Failed to prepare database statement.' });
      }

      stmt.exec(params, (execErr, result) => {
        if (execErr) {
          console.error('Error executing statement:', execErr);
          stmt.drop();
          conn.disconnect();
          return res.status(500).json({ error: 'Failed to execute database statement.' });
        }

        successCallback(result, stmt, conn);
      });
    });
  });
};

export const getProductsByBranch = async (req, res) => {
  const { idSucursal } = req.params;
  console.log(`Workspaceing products for idSucursal: ${idSucursal}`);

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
  console.log(`Creating ticket for idSucursal: ${idSucursal}, product: ${product.nombreProductoo}, quantity: ${cantidad}`);

  if (!idSucursal || !product || !product.idProducto || !product.precio || !cantidad || cantidad <= 0) {
    return res.status(400).json({ error: 'Missing or invalid ticket data.' });
  }

  const conn = hana.createConnection();
  conn.connect(connParams, (connectErr) => {
    if (connectErr) {
      console.error('Connection failed for ticket creation:', connectErr);
      return res.status(500).json({ error: 'Database connection failed for ticket creation.' });
    }

    conn.exec('START TRANSACTION', (transErr) => {
      if (transErr) {
        console.error('Failed to start transaction:', transErr);
        conn.disconnect();
        return res.status(500).json({ error: 'Failed to start database transaction.' });
      }

      const checkAvailabilityQuery = `
        SELECT "cantidadProducto" FROM "BACKPYMEX"."Almacenamiento"
        WHERE "idProducto" = ? AND "idSucursal" = ?;
      `;
      conn.prepare(checkAvailabilityQuery, (checkPrepErr, checkStmt) => {
        if (checkPrepErr) {
          console.error('Failed to prepare availability check:', checkPrepErr);
          conn.exec('ROLLBACK', () => conn.disconnect());
          return res.status(500).json({ error: 'Failed to prepare availability check.' });
        }

        checkStmt.exec([product.idProducto, idSucursal], (checkExecErr, checkRows) => {
          if (checkExecErr) {
            console.error('Failed to execute availability check:', checkExecErr);
            checkStmt.drop();
            conn.exec('ROLLBACK', () => conn.disconnect());
            return res.status(500).json({ error: 'Failed to execute availability check.' });
          }

          if (checkRows.length === 0) {
            console.warn(`Product idProducto ${product.idProducto} not found in Almacenamiento for idSucursal ${idSucursal}.`);
            checkStmt.drop();
            conn.exec('ROLLBACK', () => conn.disconnect());
            return res.status(404).json({ error: 'Product not found in this branch\'s inventory.' });
          }

          const availableQuantity = checkRows[0].cantidadProducto;
          if (availableQuantity < cantidad) {
            console.warn(`Insufficient stock for idProducto ${product.idProducto} at idSucursal ${idSucursal}. Available: ${availableQuantity}, Requested: ${cantidad}`);
            checkStmt.drop();
            conn.exec('ROLLBACK', () => conn.disconnect());
            return res.status(400).json({ error: `Insufficient product quantity. Only ${availableQuantity} available.` });
          }
          checkStmt.drop();

          const insertTicketQuery = `
            INSERT INTO "BACKPYMEX"."Ticket" ("fechaVenta", "cantidadTotal", "idSucursal")
            VALUES (CURRENT_DATE, ?, ?);
          `;
          conn.prepare(insertTicketQuery, (ticketPrepErr, ticketStmt) => {
            if (ticketPrepErr) {
              console.error('Failed to prepare ticket insert:', ticketPrepErr);
              conn.exec('ROLLBACK', () => conn.disconnect());
              return res.status(500).json({ error: 'Failed to prepare ticket insert.' });
            }

            ticketStmt.exec([cantidad, idSucursal], (ticketExecErr, ticketResult) => {
              if (ticketExecErr) {
                console.error('Failed to execute ticket insert:', ticketExecErr);
                ticketStmt.drop();
                conn.exec('ROLLBACK', () => conn.disconnect());
                return res.status(500).json({ error: 'Failed to insert ticket.' });
              }
              
              conn.exec('SELECT CURRENT_IDENTITY_VALUE() AS "idTicket" FROM DUMMY;', (idErr, idRows) => {
                if (idErr || !idRows || idRows.length === 0) {
                  console.error('Failed to get last inserted ID:', idErr);
                  ticketStmt.drop();
                  conn.exec('ROLLBACK', () => conn.disconnect());
                  return res.status(500).json({ error: 'Failed to get new ticket ID.' });
                }
                const newTicketId = idRows[0].idTicket;
                ticketStmt.drop();

                const insertTicketProductQuery = `
                  INSERT INTO "BACKPYMEX"."Ticket_Producto" ("cantidad", "idTicket", "idProducto")
                  VALUES (?, ?, ?);
                `;
                conn.prepare(insertTicketProductQuery, (tpPrepErr, tpStmt) => {
                  if (tpPrepErr) {
                    console.error('Failed to prepare Ticket_Producto insert:', tpPrepErr);
                    conn.exec('ROLLBACK', () => conn.disconnect());
                    return res.status(500).json({ error: 'Failed to prepare ticket product insert.' });
                  }

                  tpStmt.exec([cantidad, newTicketId, product.idProducto], (tpExecErr, tpResult) => {
                    if (tpExecErr) {
                      console.error('Failed to execute Ticket_Producto insert:', tpExecErr);
                      tpStmt.drop();
                      conn.exec('ROLLBACK', () => conn.disconnect());
                      return res.status(500).json({ error: 'Failed to insert ticket product.' });
                    }
                    tpStmt.drop();

                    const updateAlmacenamientoQuery = `
                      UPDATE "BACKPYMEX"."Almacenamiento"
                      SET "cantidadProducto" = "cantidadProducto" - ?
                      WHERE "idProducto" = ? AND "idSucursal" = ?;
                    `;
                    conn.prepare(updateAlmacenamientoQuery, (almPrepErr, almStmt) => {
                      if (almPrepErr) {
                        console.error('Failed to prepare Almacenamiento update:', almPrepErr);
                        conn.exec('ROLLBACK', () => conn.disconnect());
                        return res.status(500).json({ error: 'Failed to prepare inventory update.' });
                      }

                      almStmt.exec([cantidad, product.idProducto, idSucursal], (almExecErr, almResult) => {
                        if (almExecErr) {
                          console.error('Failed to execute Almacenamiento update:', almExecErr);
                          almStmt.drop();
                          conn.exec('ROLLBACK', () => conn.disconnect());
                          return res.status(500).json({ error: 'Failed to update inventory.' });
                        }
                        almStmt.drop();

                        conn.exec('COMMIT', (commitErr) => {
                          if (commitErr) {
                            console.error('Failed to commit transaction:', commitErr);
                            conn.disconnect();
                            return res.status(500).json({ error: 'Failed to commit transaction.' });
                          }
                          console.log(`Ticket ${newTicketId} created successfully for idSucursal ${idSucursal}. Inventory updated.`);
                          res.status(201).json({ message: 'Ticket created successfully', idTicket: newTicketId });
                          conn.disconnect();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

export const getTicketsByBranch = async (req, res) => {
  const { idSucursal } = req.params;
  console.log(`Workspaceing tickets for idSucursal: ${idSucursal}`);

  const query = `
    SELECT
      T."idTicket",
      TO_NVARCHAR(T."fechaVenta", 'YYYY-MM-DD') AS "fechaVenta", -- Format date as string here
      TP."cantidad",
      P."nombreProductoo" AS "productName",
      P."precioProducto" -- Corrected column name
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
          fechaVenta: row.fechaVenta, // This is already a string now
          products: [],
          totalImporte: 0,
          totalQuantity: 0
        });
      }
      const ticket = ticketsMap.get(row.idTicket);
      const itemImporte = row.cantidad * row.precioProducto; // Use precioProducto

      ticket.products.push({
        productName: row.productName,
        cantidad: row.cantidad,
        pricePerUnit: row.precioProducto, // Use precioProducto
        itemImporte: itemImporte
      });
      ticket.totalImporte += itemImporte;
      ticket.totalQuantity += row.cantidad;
    });

    const formattedTickets = Array.from(ticketsMap.values()).map(ticket => ({
        idTicket: ticket.idTicket,
        fechaVenta: ticket.fechaVenta, // No .toISOString() needed here
        products: ticket.products,
        totalImporte: ticket.totalImporte.toFixed(2),
        cantidadTotal: ticket.totalQuantity
    }));

    console.log(`Found ${formattedTickets.length} formatted tickets for idSucursal ${idSucursal}.`);
    res.status(200).json(formattedTickets);
    stmt.drop();
    conn.disconnect();
  });
};