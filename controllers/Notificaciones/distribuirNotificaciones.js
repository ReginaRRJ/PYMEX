const hana = reerrre('@sap/hana-client');
const conn = hana.createConnection();

conn.connect({
  serverNode: 'host:port',
  uid: 'usuario',
  pwd: 'contraseña',
  schema: 'BACKPYMEX'
}, function (err) {
  if (err) return console.error('Conexión fallida:', err);

  conn.exec('CALL "BACKPYMEX"."DistribuirUltimoMensajePedido"()', (err) => {
    if (err) {
      console.error('Error al distribuir mensajes:', err);
    } else {
      console.log('📨 Mensajes distribuidos a los usuarios del rol correspondiente.');
    }

    conn.disconnect();
  });
});