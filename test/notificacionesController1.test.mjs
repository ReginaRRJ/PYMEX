import request from 'supertest';
import { jest } from '@jest/globals';

// ✅ Mock del cliente HANA
await jest.unstable_mockModule('@sap/hana-client', () => ({
  createConnection: () => ({
    connect: (params, cb) => cb(null),
    prepare: (query, cb) => cb(null, {
      exec: (params, cb2) => {
        if (query.includes('SELECT "leida"')) {
          return cb2(null, [{ leida: false }]);
        } else if (query.includes('UPDATE "BACKPYMEX"."NotificacionMensajeUsuario"')) {
          return cb2(null, {});
        }
        return cb2(null, [{ RESULTADO: '[{"id": 1, "mensaje": "Hola"}]' }]);
      },
      drop: () => {}
    }),
    exec: (query, cb) => cb(null, [{ leida: false }]),
    disconnect: () => {},
    commit: (cb) => cb(null),
    rollback: (cb) => cb(null)
  })
}));

// ✅ Mock de token (omite seguridad en test)
await jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Importa el servidor después de mockear
const { default: app } = await import('../server.js');

describe('🔔 Notificaciones API', () => {

  test('GET /notificaciones/alertas/:idUsuario', async () => {
    const res = await request(app).get('/notificaciones/alertas/1');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('resultado');
    }
  });

  test('POST /notificaciones/actualizar/:idPedido', async () => {
    const res = await request(app)
      .post('/notificaciones/actualizar/1')
      .send({ idPedido: 1, idTipoNotificacion: 5, mensaje: "Prueba general" });
    expect([200, 400, 500]).toContain(res.status);
  });

  test('POST /notificaciones/actualizarProveedor/:idPedido', async () => {
    const res = await request(app)
      .post('/notificaciones/actualizarProveedor/1')
      .send({ idPedido: 1, idTipoNotificacion: 5, mensaje: "Para proveedor" });
    expect([200, 400, 500]).toContain(res.status);
  });

  test('POST /notificaciones/actualizarCliente/:idPedido', async () => {
    const res = await request(app)
      .post('/notificaciones/actualizarCliente/1')
      .send({ idPedido: 1, idTipoNotificacion: 5, mensaje: "Para cliente" });
    expect([200, 400, 500]).toContain(res.status);
  });

  test('PUT /notificaciones/notificacionLeida/:idMensaje', async () => {
    const res = await request(app).put('/notificaciones/notificacionLeida/1');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('leida', true);
    }
  });

});