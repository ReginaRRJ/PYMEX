// test/notifConfigController.test.mjs
import { jest } from '@jest/globals';

// Forzar mock para hana-client con default
jest.unstable_mockModule('@sap/hana-client', () => ({
  default: {
    createConnection: jest.fn(() => ({
      connect: jest.fn(),
      prepare: jest.fn((query, cb) => {
        cb(null, {
          exec: (params, cb2) => {
            cb2(null, [{
              idNotificacion: 1,
              nombre: 'Alerta de stock',
              activo: true,
              descripcion: 'Notifica cuando hay poco stock',
              parametroTiempo: 12
            }]);
          }
        });
      }),
      disconnect: jest.fn()
    }))
  }
}));

// Importa el controlador después del mock
const { getNotificationConfig } = await import('../controllers/notifConfigController.js');

test('getNotificationConfig responde con configuración', async () => {
  const req = { params: { idUsuario: 1 } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  await getNotificationConfig(req, res);

  expect(res.json).toHaveBeenCalledWith([{
    idNotificacion: 1,
    nombre: 'Alerta de stock',
    activo: true,
    descripcion: 'Notifica cuando hay poco stock',
    parametroTiempo: 12
  }]);
});