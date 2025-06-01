// controllers/clientVentasCrud.js
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};

export const getSalesData = (req, res) => {
    const { idPyme } = req.params;

    if (!idPyme) {
        return res.status(400).send("idPyme is required.");
    }

    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
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
                "Ticket" AS T
            JOIN
                "Sucursal" AS S ON T."idSucursal" = S."idSucursal"
            JOIN
                "Pyme" AS PY ON S."idPyme" = PY."idPyme"
            LEFT JOIN (
                SELECT
                    TP."idTicket",
                    STRING_AGG(
                        COALESCE(P."nombreProductoo", 'Desconocido') || ' (' || COALESCE(TP."cantidad", 0) || ')',
                        ', '
                    ) AS productosVendidos,
                    SUM(COALESCE(TP."cantidad", 0) * COALESCE(P."precioProducto", 0)) AS totalTicketPrice
                FROM
                    "Ticket_Producto" AS TP
                JOIN
                    "Producto" AS P ON TP."idProducto" = P."idProducto"
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

                // --- ADD THIS DEBUG LOG HERE ---
                console.log("\n--- DEBUG: Raw Sales Data from HANA ---");
                console.log(JSON.stringify(results, null, 2)); // Use JSON.stringify for better readability
                console.log("--- END DEBUG: Raw Sales Data ---\n");
                // --- END DEBUG LOG ---

                statement.drop();
                conn.disconnect();
                return res.status(200).json(results);
            });
        });
    });
};
// import hana from '@sap/hana-client';
// import dotenv from 'dotenv';

// dotenv.config();

// const connParams = {
//     serverNode: process.env.DB_HOST,
//     uid: process.env.DB_USER,
//     pwd: process.env.DB_PASSWORD
// };

// export const getSalesData = (req, res) => {
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
//                 T."fechaVenta",
//                 T."cantidadTotal" AS totalItemsInTicket, 
//                 S."nombre" AS nombreSucursal,
//                 P."nombreProductoo",
//                 TP."cantidad" AS quantityOfThisProduct, 
//                 P."precioProducto", 
//                 (TP."cantidad" * P."precioProducto") AS costoProductoUnitario 
//             FROM
//                 "Ticket" AS T
//             JOIN
//                 "Sucursal" AS S ON T."idSucursal" = S."idSucursal"
//             JOIN
//                 "Pyme" AS PY ON S."idPyme" = PY."idPyme"
//             JOIN
//                 "Ticket_Producto" AS TP ON T."idTicket" = TP."idTicket"
//             JOIN
//                 "Producto" AS P ON TP."idProducto" = P."idProducto"
//             WHERE
//                 PY."idPyme" = ?;
//         `;

//         conn.prepare(sqlQuery, (err, statement) => {
//             if (err) {
//                 console.error("Error preparando consulta:", err);
//                 conn.disconnect();
//                 return res.status(500).send("Error preparando la consulta");
//             }

//             statement.exec([idPyme], (err, results) => {
//                 if (err) {
//                     console.error("Error ejecutando consulta:", err);
//                     statement.drop();
//                     conn.disconnect();
//                     return res.status(500).send("Error ejecutando la consulta");
//                 }

//                 statement.drop();
//                 conn.disconnect();
//                 return res.status(200).json(results);
//             });
//         });
//     });
// };