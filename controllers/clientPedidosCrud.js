import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
    serverNode: process.env.DB_HOST,
    uid: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD
};
//Obtener todos los pedidos
export const getPedidosByPyme = (req, res) => {
    const { idPyme } = req.params;

    if (!idPyme) {
        console.error("DEBUG: getPedidosByPyme - idPyme is missing.");
        return res.status(400).send("Se requiere id de la PYME.");
    }


    const conn = hana.createConnection();

    conn.connect(connParams, (err) => {
        if (err) {
            console.error("Error al conectar a SAP HANA:", err);
            return res.status(500).send("Error conectando a SAP HANA");
        }


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
                "BACKPYMEX"."Pedido" AS P  
            JOIN
                "BACKPYMEX"."Sucursal" AS S ON P."idSucursal" = S."idSucursal"  
            JOIN
                "BACKPYMEX"."Producto" AS PROD ON P."idProducto" = PROD."idProducto"  
            WHERE
                S."idPyme" = ?
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

//Actualizar el estatus del pedido del cliente
export const updatePedidoEstatusCliente = (req, res) => {
    const { idPedido } = req.params;
    const { estatusCliente } = req.body;

    if (!idPedido || !estatusCliente) {
        console.error("Falta idPedido or estatusCliente is missing.");
        return res.status(400).send("idPedido y estatusCliente son requeridos.");
    }

    if (estatusCliente !== 'Autorizado' && estatusCliente !== 'No autorizado') {
        console.error(`Estatus inválido: ${estatusCliente}`);
        return res.status(400).send("El estatus del cliente debe ser 'Autorizado' o 'No autorizado'.");
    }

    const conn = hana.createConnection();

    conn.connect(connParams, async (err) => {
        if (err) {
            console.error("Error al conectar a SAP HANA:", err);
            return res.status(500).send("Error conectando a SAP HANA");
        }

        console.log("Conectado a SAP HANA Cloud");

        try {
            const queryClientStatus = `UPDATE "BACKPYMEX"."Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`; 
            
            await conn.exec(queryClientStatus, [estatusCliente, idPedido]);

            if (estatusCliente === 'Autorizado') {
                const checkSupplierStatusQuery = `
                    SELECT "estatusProveedor"  
                    FROM "BACKPYMEX"."Pedido"  
                    WHERE "idPedido" = ?
                `;
                
                const results = await conn.exec(checkSupplierStatusQuery, [idPedido]);
                const result = results.length > 0 ? results[0] : null;

                if (result && result.estatusProveedor === 'Por autorizar') { 
                    const updateSupplierStatusQuery = `
                        UPDATE "BACKPYMEX"."Pedido"  
                        SET "estatusProveedor" = 'Pendiente'
                        WHERE "idPedido" = ?
                    `;
                    
                    await conn.exec(updateSupplierStatusQuery, [idPedido]);
                    
                }
            }

            conn.disconnect();
            res.status(200).send({ message: 'Estatus de pedido actualizado correctamente.' });

        } catch (error) {
            console.error('Error al actualizar estatus de pedido:', error);
            if (conn && conn.isConnected) {
                conn.disconnect();
            }
            res.status(500).send({ message: 'Error interno del servidor al actualizar el estatus del pedido.', error: error.message });
        }
    });
};
