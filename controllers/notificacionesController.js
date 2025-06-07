const hana = require('@sap/hana-client');

// Configura la conexión
const conn = hana.createConnection();
conn.connect({
  serverNode: 'your-server:30015',   // ejemplo: 'localhost:39013'
  uid: 'YOUR_USER',
  pwd: 'YOUR_PASSWORD'
});

async function notificarCambioEstado(idPedido, nuevoEstatus) {
  try {
    // Construye el mensaje personalizado
    const mensaje = `Tu pedido #${idPedido} ha cambiado de estado a "${nuevoEstatus}".`;
    const idTipoNotificacion = 9; // ID correspondiente a notificación de cambio de estatus

    // Ejecuta el procedimiento
    await conn.exec(
      `CALL "BACKPYMEX"."N9Cliente"(?, ?, ?)`,
      [idPedido, idTipoNotificacion, mensaje]
    );

    console.log('✅ Notificación enviada correctamente');

  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  } finally {
    conn.disconnect();
  }
}

async function actualizarEstatusPedido(idPedido,nuevoEstatus){
    await conn.exec(
      ⁠ CALL "BACKPYMEX"."N9Cliente"(?, ?, ?) ⁠,
      [idPedido, idTipoNotificacion, mensaje]
    );

    console.log('✅ Notificación enviada correctamente');

  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  } finally {
    conn.disconnect();
  }
}
// 🔁 Ejemplo de uso
notificarCambioEstado(255, 'En camino');