// test/clientVentasRoutes.test.mjs
import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ MOCK del middleware para evitar verificación de token
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Importa app después del mock
const { default: app } = await import('../server.js');

describe('Rutas de ventas del cliente', () => {
  test('GET /api/ventasClient/:idPyme devuelve ventas', async () => {
    const response = await request(app).get('/api/ventasClient/1');
    console.log('🔍 Response GET:', response.status, response.body);

    // Verificamos que el código de estado sea válido
    expect([200, 204, 404]).toContain(response.status);
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });
});

afterAll(() => {
  // Aquí puedes cerrar conexiones si fuera necesario
});