// notify.js
import hana from '@sap/hana-client';
import dotenv from 'dotenv';

dotenv.config();

const connParams = {
  serverNode: process.env.DB_HOST,
  uid: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD
};

const conn = hana.createConnection();

// // Función para notificar cambio de estado
// export async function notificarCambioEstado(idPedido, nuevoEstatus) {
//   try {
//     conn.connect(connParams);

//     const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
//     const idTipoNotificacion = 9;

//     await conn.exec(
//       `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?)`,
//       [idPedido, idTipoNotificacion, mensaje]
//     );

//     console.log('✅ Notificación enviada correctamente');
//   } catch (error) {
//     console.error('❌ Error al enviar notificación:', error);
//   } finally {
//     conn.disconnect();
//   }
// }

// export async function actualizarEstatusPedido(idPedido, nuevoEstatus, idUsuario) {
//   try {
//     conn.connect(connParams);

//     // 1. Obtener el estatus anterior
//     const queryAnterior = `SELECT "estatusCliente" FROM "BACKPYMEX"."Pedido" WHERE "idPedido" = ?`;
//     const result = await conn.exec(queryAnterior, [idPedido]);

//     if (!result || result.length === 0) {
//       console.log('Pedido no encontrado');
//       return;
//     }

//     const estatusAnterior = result[0].estatusCliente;

//     // 2. Si el estatus no ha cambiado, no hacer nada
//     if (estatusAnterior === nuevoEstatus) {
//       console.log('El estatus no cambió');
//       return;
//     }

//     // 3. Actualizar el estatus del pedido
//     const updateQuery = `UPDATE "BACKPYMEX"."Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`;
//     await conn.exec(updateQuery, [nuevoEstatus, idPedido]);

//     // 4. Construir el mensaje
//     const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
//     const idTipoNotificacion = 9;

//     // 5. Llamar al procedimiento con los 4 parámetros
//     await conn.exec(
//       `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?, ?)`,
//       [idPedido, idTipoNotificacion, mensaje, idUsuario]
//     );

//     console.log('Estatus actualizado y notificación enviada');
//   } catch (err) {
//     console.error('Error al actualizar el estatus:', err);
//   } finally {
//     conn.disconnect();
//   }
// }

export async function actualizarEstatusPedidoProveedor(idPedido, nuevoEstatus, idUsuario) {
  try {
    conn.connect(connParams);

    // 1. Obtener el estatus anterior
    const queryAnterior = `SELECT "estatusCliente" FROM "BACKPYMEX"."Pedido" WHERE "idPedido" = ?`;
    const result = await conn.exec(queryAnterior, [idPedido]);

    if (!result || result.length === 0) {
      console.log('Pedido no encontrado');
      return;
    }

    const estatusAnterior = result[0].estatusCliente;

    // 2. Si el estatus no ha cambiado, no hacer nada
    if (estatusAnterior === nuevoEstatus) {
      console.log('El estatus no cambió');
      return;
    }

    // 3. Actualizar el estatus del pedido
    const updateQuery = `UPDATE "BACKPYMEX"."Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`;
    await conn.exec(updateQuery, [nuevoEstatus, idPedido]);

    // 4. Construir el mensaje
    const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
    const idTipoNotificacion = 6;

    // 5. Llamar al procedimiento con los 4 parámetros
    await conn.exec(
      `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?, ?)`,
      [idPedido, idTipoNotificacion, mensaje, idUsuario]
    );

    console.log('Estatus actualizado y notificación enviada');
  } catch (err) {
    console.error('Error al actualizar el estatus:', err);
  } finally {
    conn.disconnect();
  }
}

// 🔁 Uso (ejemplo con el usuario logueado 61)
// actualizarEstatusPedido(45, 'En camino', 61);

// 🔁 Ejemplo de uso (puedes comentar esta línea si no se necesita)
// notificarCambioEstado(255, 'En camino');

// // notify.js
// import hana from '@sap/hana-client';
// import dotenv from 'dotenv';

// dotenv.config();


// const connParams = {
//     serverNode: process.env.DB_HOST,
//     uid: process.env.DB_USER,
//     pwd: process.env.DB_PASSWORD
// };

// // // Función para notificar cambio de estado
// // async function notificarCambioEstado(idPedido, nuevoEstatus) {
// //   try {
// //     const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
// //     const idTipoNotificacion = 9;

// //     await conn.exec(
// //       `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?)`,
// //       [idPedido, idTipoNotificacion, mensaje]
// //     );

// //     console.log('✅ Notificación enviada correctamente');
// //   } catch (error) {
// //     console.error('❌ Error al enviar notificación:', error);
// //   } finally {
// //     conn.disconnect();
// //   }
// // }

// // async function actualizarEstatusPedido(idPedido, nuevoEstatus, idUsuario) {
// //   try {
// //     // 1. Obtener el estatus anterior
// //     const queryAnterior = `SELECT "estatusCliente" FROM "BACKPYMEX"."Pedido" WHERE "idPedido" = ?`;
// //     const result = await conn.exec(queryAnterior, [idPedido]);

// //     if (!result || result.length === 0) {
// //       console.log('Pedido no encontrado');
// //       return;
// //     }

// //     const estatusAnterior = result[0].estatusCliente;

// //     // 2. Si el estatus no ha cambiado, no hacer nada
// //     if (estatusAnterior === nuevoEstatus) {
// //       console.log('El estatus no cambió');
// //       return;
// //     }

// //     // 3. Actualizar el estatus del pedido
// //     const updateQuery = `UPDATE "BACKPYMEX"."Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`;
// //     await conn.exec(updateQuery, [nuevoEstatus, idPedido]);

// //     // 4. Construir el mensaje
// //     const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
// //     const idTipoNotificacion = 9;

// //     // 5. Llamar al procedimiento con los 4 parámetros
// //     await conn.exec(
// //       `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?, ?)`,
// //       [idPedido, idTipoNotificacion, mensaje, idUsuario]
// //     );

// //     console.log('Estatus actualizado y notificación enviada');

// //   } catch (err) {
// //     console.error('Error al actualizar el estatus:', err);
// //   } finally {
// //     conn.disconnect();
// //   }
// // }
// export async function actualizarEstatusPedidoProveedor(idPedido, nuevoEstatus, idUsuario) {
//   try {
//     // 1. Obtener el estatus anterior
//     const queryAnterior = `SELECT "estatusCliente" FROM "BACKPYMEX"."Pedido" WHERE "idPedido" = ?`;
//     const result = await conn.exec(queryAnterior, [idPedido]);

//     if (!result || result.length === 0) {
//       console.log('Pedido no encontrado');
//       return;
//     }

//     const estatusAnterior = result[0].estatusCliente;

//     // 2. Si el estatus no ha cambiado, no hacer nada
//     if (estatusAnterior === nuevoEstatus) {
//       console.log('El estatus no cambió');
//       return;
//     }

//     // 3. Actualizar el estatus del pedido
//     const updateQuery = `UPDATE "BACKPYMEX"."Pedido" SET "estatusCliente" = ? WHERE "idPedido" = ?`;
//     await conn.exec(updateQuery, [nuevoEstatus, idPedido]);

//     // 4. Construir el mensaje
//     const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
//     const idTipoNotificacion = 6;

//     // 5. Llamar al procedimiento con los 4 parámetros
//     await conn.exec(
//       `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?, ?)`,
//       [idPedido, idTipoNotificacion, mensaje, idUsuario]
//     );

//     console.log('Estatus actualizado y notificación enviada');

//   } catch (err) {
//     console.error('Error al actualizar el estatus:', err);
//   } finally {
//     conn.disconnect();
//   }
// }

// // 🔁 Uso (ejemplo con el usuario logueado 61)
// actualizarEstatusPedido(45, 'En camino', 61);

// // 🔁 Ejemplo de uso (puedes comentar esta línea si no se necesita)
// notificarCambioEstado(255, 'En camino');
