// test/notificacionesController.test.mjs
import { jest } from '@jest/globals';

// Mock explícito del módulo @sap/hana-client
jest.unstable_mockModule('@sap/hana-client', () => ({
  default: {
    createConnection: () => ({
      connect: jest.fn(),
      prepare: jest.fn((query, cb) => {
        const mockStatement = {
          exec: (params, cb) => {
            if (query.includes("SELECT")) {
              cb(null, [{ leida: false }]);  // Simula que no estaba leída
            } else {
              cb(null);
            }
          },
          drop: jest.fn()
        };
        cb(null, mockStatement);
      }),
      commit: jest.fn((cb) => cb(null)),
      rollback: jest.fn((cb) => cb(null)),
      disconnect: jest.fn()
    })
  }
}));

// Import dinámico después del mock
const { notificacionLeida } = await import('../controllers/notificacionesController.js');

test('notificacionLeida responde correctamente cuando no estaba leída', async () => {
  const req = { params: { idMensaje: '1' } };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await notificacionLeida(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Marcada como leída',
    leida: true
  });
});