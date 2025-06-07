
const hana = require('@sap/hana-client');
const conn = hana.createConnection();

conn.connect({
  serverNode: 'host:port',
  uid: 'usuario',
  pwd: 'contraseña',
  schema: 'BACKPYMEX'
}, async function (err) {
  if (err) return console.error('Conexión fallida:', err);

  try {
    const pedidos = await new Promise((resolve, reject) => {
      conn.exec(
        SELECT "idPedido", "estatusProveedor" FROM "BACKPYMEX"."Pedido",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    for (const pedido of pedidos) {
      const { idPedido, estatusProveedor } = pedido;

      const auditoria = await new Promise((resolve) => {
        conn.exec(
          SELECT "estatusAnterior" FROM "BACKPYMEX"."AuditoriaEstatusPedido" WHERE "idPedido" = ?,
          [idPedido],
          (err, rows) => resolve(rows[0])
        );
      });

      if (!auditoria) {
        await new Promise((resolve) =>
          conn.exec(
            INSERT INTO "BACKPYMEX"."AuditoriaEstatusPedido" ("idPedido", "estatusAnterior") VALUES (?, ?),
            [idPedido, estatusProveedor],
            resolve
          )
        );
      } else if (auditoria.estatusAnterior !== estatusProveedor) {
        const mensaje = El pedido ${idPedido} cambió de estatus a "${estatusProveedor}".;

        await new Promise((resolve) =>
          conn.exec(
            INSERT INTO "BACKPYMEX"."NotificacionMensaje" ("idNotificacion", "mensaje", "fecha") VALUES (?, ?, CURRENT_TIMESTAMP),
            [2, mensaje],
            resolve
          )
        );

        await new Promise((resolve) =>
          conn.exec(
            UPDATE "BACKPYMEX"."AuditoriaEstatusPedido" SET "estatusAnterior" = ?, "fechaCambio" = CURRENT_TIMESTAMP WHERE "idPedido" = ?,
            [estatusProveedor, idPedido],
            resolve
          )
        );

        console.log(🔔 Notificación generada para pedido ${idPedido});
      }
    }

    conn.disconnect();
  } catch (err) {
    console.error('Error ejecutando lógica:', err);
    conn.disconnect();
  }
});