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
                T."fechaVenta",
                T."cantidadTotal" AS totalItemsInTicket, 
                S."nombre" AS nombreSucursal,
                P."nombreProductoo",
                TP."cantidad" AS quantityOfThisProduct, 
                P."precioProducto", 
                (TP."cantidad" * P."precioProducto") AS costoProductoUnitario 
            FROM
                "Ticket" AS T
            JOIN
                "Sucursal" AS S ON T."idSucursal" = S."idSucursal"
            JOIN
                "Pyme" AS PY ON S."idPyme" = PY."idPyme"
            JOIN
                "Ticket_Producto" AS TP ON T."idTicket" = TP."idTicket"
            JOIN
                "Producto" AS P ON TP."idProducto" = P."idProducto"
            WHERE
                PY."idPyme" = ?;
        `;

        conn.prepare(sqlQuery, (err, statement) => {
            if (err) {
                console.error("Error preparando consulta:", err);
                conn.disconnect();
                return res.status(500).send("Error preparando la consulta");
            }

            statement.exec([idPyme], (err, results) => {
                if (err) {
                    console.error("Error ejecutando consulta:", err);
                    statement.drop();
                    conn.disconnect();
                    return res.status(500).send("Error ejecutando la consulta");
                }

                statement.drop();
                conn.disconnect();
                return res.status(200).json(results);
            });
        });
    });
};