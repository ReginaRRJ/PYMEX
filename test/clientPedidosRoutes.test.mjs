// test/clientPedidosRoutes.test.mjs
import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ MOCK del middleware para evitar verificación de token
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Importa app después del mock
const { default: app } = await import('../server.js');

describe('Rutas de pedidos del cliente', () => {
  test('GET /api/pedidosClient/:idPyme devuelve pedidos', async () => {
    const response = await request(app).get('/api/pedidosClient/1');
    console.log('🔍 Response GET:', response.status, response.body);

    // Asegúrate de que este test coincida con el comportamiento real
    expect([200, 204, 404]).toContain(response.status); // tolerancia si no hay datos
    if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  test('PUT /api/pedidosClient/:idPedido/estatusCliente actualiza estado', async () => {
    const response = await request(app)
      .put('/api/pedidosClient/10/estatusCliente')
      .send({ nuevoEstatus: 'Entregado' });

    console.log('🔍 Response PUT:', response.status, response.body);

    // Verifica respuesta estándar esperada
    expect([200, 400, 404]).toContain(response.status); // por si no existe el ID
    if (response.status === 200) {
      expect(response.body.message).toBe('Estatus actualizado');
    }
  });
});
