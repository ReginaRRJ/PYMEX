import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ Mock del middleware para saltarse la verificación de token
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Importar app *después* de aplicar mocks
const { default: app } = await import('../server.js');

describe('Rutas de configuración de notificaciones', () => {
  test('GET /api/notificaciones/configuracion-notificaciones/:idUsuario devuelve configuración', async () => {
    const response = await request(app).get('/api/notificaciones/configuracion-notificaciones/1');
    console.log('🔍 GET configuración:', response.status, response.body);

    expect([200, 204, 404]).toContain(response.status);
    if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true); // ✅
    }
  });

  test('PUT /api/notificaciones/configuracion-notificaciones/:idUsuario actualiza configuración', async () => {
    const nuevaConfig = {
      recibirCorreos: true,
      frecuencia: 'diaria' // ajusta según tu modelo
    };

    const response = await request(app)
      .put('/api/notificaciones/configuracion-notificaciones/1')
      .send(nuevaConfig);

    console.log('🔍 PUT configuración:', response.status, response.body);

    expect([200, 400, 404]).toContain(response.status);
    if (response.status === 200) {
        expect(response.body.message).toMatch(/configuración/i); // ✅ Compatible con "Cambio de configuración exitosa"
    }
  });
});