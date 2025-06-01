// controllers/pedidosPymeController.js
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

export const getPedidosByPyme = (req, res) => {
    const { idPyme } = req.params;

    if (!idPyme) {
        console.error("DEBUG: getPedidosByPyme - idPyme is missing.");
        return res.status(400).send("idPyme is required.");
    }

    console.log(`DEBUG: getPedidosByPyme - Attempting to fetch pedidos for idPyme: ${idPyme}`);

    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
        if (err) {
            console.error("DEBUG: getPedidosByPyme - Error al conectar a SAP HANA:", err);
            return res.status(500).send("Error conectando a SAP HANA");
        }

        console.log("DEBUG: getPedidosByPyme - Conectado a SAP HANA Cloud");

        const sqlQuery = `
            SELECT
                S."nombreSucursal",
                P."cantidad" AS cantidadPedido,
                PROD."precioProducto",
                (P."cantidad" * PROD."precioProducto") AS totalPedidoProducto,
                COALESCE(P."estatusCliente", 'No autorizado') AS estatusCliente,
                P."estatusProveedor" AS estatusGeneralPedido,
                P."fechaEntregaEstimada",
                PROD."nombreProductoo",
                P."idPedido"
            FROM
                "Pedido" AS P
            JOIN
                "Sucursal" AS S ON P."idSucursal" = S."idSucursal"
            JOIN
                "Producto" AS PROD ON P."idProducto" = PROD."idProducto"
            WHERE
                S."idPyme" = ?
            ORDER BY
                P."fechaCreacion" DESC;
        `;

        console.log(`DEBUG: getPedidosByPyme - SQL Query:\n${sqlQuery}`);
        console.log(`DEBUG: getPedidosByPyme - Query Parameters: [${idPyme}]`);


        conn.prepare(sqlQuery, (err, statement) => {
            if (err) {
                console.error("DEBUG: getPedidosByPyme - Error preparando consulta para pedidos:", err);
                conn.disconnect();
                return res.status(500).send("Error preparando la consulta de pedidos");
            }

            statement.exec([idPyme], (err, results) => {
                if (err) {
                    console.error("DEBUG: getPedidosByPyme - Error ejecutando consulta para pedidos:", err);
                    statement.drop();
                    conn.disconnect();
                    return res.status(500).send("Error ejecutando la consulta de pedidos");
                }

                console.log("\n--- DEBUG: getPedidosByPyme - RAW DB Results ---");
                if (results.length > 0) {
                    results.forEach((row, index) => {
                        console.log(`Row ${index + 1}:`, row);
                        if (row.cantidadPedido === null || row.cantidadPedido === undefined) {
                            console.warn(`WARN: Row ${index + 1} has null/undefined cantidadPedido.`);
                        }
                    });
                } else {
                    console.log("No results returned from database.");
                }
                console.log("--- DEBUG: END RAW DB Results ---\n");

                statement.drop();
                conn.disconnect();
                return res.status(200).json(results);
            });
        });
    });
};

export const updatePedidoEstatusCliente = (req, res) => {
    const { idPedido } = req.params;
    const { estatusCliente } = req.body;

    if (!idPedido || !estatusCliente) {
        console.error("DEBUG: updatePedidoEstatusCliente - idPedido or estatusCliente is missing.");
        return res.status(400).send("idPedido y estatusCliente son requeridos.");
    }

    if (estatusCliente !== 'Autorizado' && estatusCliente !== 'No autorizado') {
        console.error(`DEBUG: updatePedidoEstatusCliente - Invalid estatusCliente: ${estatusCliente}`);
        return res.status(400).send("El estatus del cliente debe ser 'Autorizado' o 'No autorizado'.");
    }

    console.log(`DEBUG: updatePedidoEstatusCliente - Attempting to update idPedido: ${idPedido} to estatusCliente: ${estatusCliente}`);

    const conn = hana.createConnection();

    conn.connect(connParams, async (err) => { // Made callback async to use await inside
        if (err) {
            console.error("DEBUG: updatePedidoEstatusCliente - Error al conectar a SAP HANA:", err);
            return res.status(500).send("Error conectando a SAP HANA");
        }

        console.log("DEBUG: updatePedidoEstatusCliente - Conectado a SAP HANA Cloud");

        try {
            // First, update the ESTATUSCLIENTE
            const queryClientStatus = `UPDATE "Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`;
            console.log(`DEBUG: updatePedidoEstatusCliente - Client Status SQL Query:\n${queryClientStatus}`);
            console.log(`DEBUG: updatePedidoEstatusCliente - Client Status Query Parameters: [${estatusCliente}, ${idPedido}]`);

            // Use conn.exec directly for single statements or when you don't need prepared statement reuse
            await conn.exec(queryClientStatus, [estatusCliente, idPedido]);

            // Check if estatusCliente was set to 'Autorizado' AND ESTATUSGENERALPEDIDO was 'Por autorizar'
            if (estatusCliente === 'Autorizado') {
                const checkSupplierStatusQuery = `
                    SELECT "ESTATUSGENERALPEDIDO"
                    FROM "Pedido"
                    WHERE "idPedido" = ?
                `;
                console.log(`DEBUG: updatePedidoEstatusCliente - Check Supplier Status SQL Query:\n${checkSupplierStatusQuery}`);
                console.log(`DEBUG: updatePedidoEstatusCliente - Check Supplier Status Query Parameters: [${idPedido}]`);

                // Use conn.exec for SELECT; it returns an array of rows
                const results = await conn.exec(checkSupplierStatusQuery, [idPedido]);
                const result = results.length > 0 ? results[0] : null; // Get the first row

                if (result && result.ESTATUSGENERALPEDIDO === 'Por autorizar') {
                    // If client authorized AND supplier status is 'Por autorizar', change supplier status to 'Pendiente'
                    const updateSupplierStatusQuery = `
                        UPDATE "Pedido"
                        SET "estatusProveedor" = 'Pendiente'
                        WHERE "idPedido" = ?
                    `;
                    console.log(`DEBUG: updatePedidoEstatusCliente - Update Supplier Status SQL Query:\n${updateSupplierStatusQuery}`);
                    console.log(`DEBUG: updatePedidoEstatusCliente - Update Supplier Status Query Parameters: [${idPedido}]`);

                    await conn.exec(updateSupplierStatusQuery, [idPedido]);
                    console.log(`DEBUG: Supplier status for pedido ${idPedido} automatically updated to 'Pendiente' from 'Por autorizar'.`);
                }
            }

            conn.disconnect();
            res.status(200).send({ message: 'Estatus de pedido actualizado correctamente.' });

        } catch (error) {
            console.error('Error al actualizar estatus de pedido:', error);
            if (conn && conn.isConnected) {
                conn.disconnect(); // Ensure connection is closed on error
            }
            res.status(500).send({ message: 'Error interno del servidor al actualizar el estatus del pedido.', error: error.message });
        }
    });
};
// // controllers/pedidosPymeController.js
// import hana from '@sap/hana-client';
// import dotenv from 'dotenv';

// dotenv.config();

// const connParams = {
//     serverNode: process.env.DB_HOST,
//     uid: process.env.DB_USER,
//     pwd: process.env.DB_PASSWORD
// };

// export const getPedidosByPyme = (req, res) => {
//     const { idPyme } = req.params; 

//     if (!idPyme) {
//         return res.status(400).send("idPyme is required.");
//     }

//     const conn = hana.createConnection();

//     conn.connect(connParams, (err) => {
//         if (err) {
//             console.error("Error al conectar a SAP HANA:", err);
//             return res.status(500).send("Error conectando a SAP HANA");
//         }

//         console.log("Conectado a SAP HANA Cloud");

//         const sqlQuery = `
//             SELECT
//                 S."nombreSucursal",
//                 P."cantidad" AS cantidadPedido,
//                 PROD."precioProducto",
//                 (P."cantidad" * PROD."precioProducto") AS totalPedidoProducto,
//                 P."estatusCliente",
//                 P."fechaEntregaEstimada",
//                 PROD."nombreProductoo"
//             FROM
//                 "Pedido" AS P
//             JOIN
//                 "Producto" AS PROD ON P."idProducto" = PROD."idProducto"
//             JOIN
//                 "Sucursal" AS S ON P."idSucursal" = S."idSucursal"
//             JOIN
//                 "Pyme" AS PY ON S."idPyme" = PY."idPyme"
//             WHERE
//                 PY."idPyme" = ?
//             ORDER BY
//                 P."fechaCreacion" DESC;
//         `;

//         conn.prepare(sqlQuery, (err, statement) => {
//             if (err) {
//                 console.error("Error preparando consulta para pedidos:", err);
//                 conn.disconnect();
//                 return res.status(500).send("Error preparando la consulta de pedidos");
//             }

//             statement.exec([idPyme], (err, results) => {
//                 if (err) {
//                     console.error("Error ejecutando consulta para pedidos:", err);
//                     statement.drop();
//                     conn.disconnect();
//                     return res.status(500).send("Error ejecutando la consulta de pedidos");
//                 }

//                 statement.drop();
//                 conn.disconnect();
//                 return res.status(200).json(results);
//             });
//         });
//     });
// };