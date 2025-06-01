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
                S."nombreSucursal",
                P."cantidad" AS cantidadPedido,
                PROD."precioProducto",
                (P."cantidad" * PROD."precioProducto") AS totalPedidoProducto,
                P."estatusCliente",
                P."fechaEntregaEstimada",
                PROD."nombreProductoo"
            FROM
                "Pedido" AS P
            JOIN
                "Producto" AS PROD ON P."idProducto" = PROD."idProducto"
            JOIN
                "Sucursal" AS S ON P."idSucursal" = S."idSucursal"
            JOIN
                "Pyme" AS PY ON S."idPyme" = PY."idPyme"
            WHERE
                PY."idPyme" = ?
            ORDER BY
                P."fechaCreacion" DESC;
        `;

        conn.prepare(sqlQuery, (err, statement) => {
            if (err) {
                console.error("Error preparando consulta para pedidos:", err);
                conn.disconnect();
                return res.status(500).send("Error preparando la consulta de pedidos");
            }

            statement.exec([idPyme], (err, results) => {
                if (err) {
                    console.error("Error ejecutando consulta para pedidos:", err);
                    statement.drop();
                    conn.disconnect();
                    return res.status(500).send("Error ejecutando la consulta de pedidos");
                }

                statement.drop();
                conn.disconnect();
                return res.status(200).json(results);
            });
        });
    });
};