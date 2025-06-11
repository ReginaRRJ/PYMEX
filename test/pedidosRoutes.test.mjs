// test/pedidosRoutes.test.mjs
import { jest } from '@jest/globals';
import request from 'supertest';

// Mock de auth
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// Mock de la conexión a SAP HANA
jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    exec: jest.fn()
  }
}));

// Importar app una vez aplicados los mocks
const { default: app } = await import('../server.js');
const connection = (await import('../config/db.js')).default;

describe('Rutas de pedidos', () => {
  test('GET /api/pedidos/general devuelve lista de pedidos', async () => {
    connection.exec.mockImplementationOnce((query, cb) => {
      cb(null, [
        { id: 1, Cliente: 'Sucursal A', Estado: 'Pendiente' }
      ]);
    });

    const res = await request(app).get('/api/pedidos/general');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/pedidos/detalle/:idPedido devuelve detalles', async () => {
    connection.exec.mockImplementationOnce((query, params, cb) => {
      cb(null, [{ ID: params[0], Producto: 'Audifonos' }]);
    });

    const res = await request(app).get('/api/pedidos/detalle/123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ID', '123');
  });

  test('GET /api/pedidos/detalle/:idPedido devuelve 404 si no hay pedido', async () => {
    connection.exec.mockImplementationOnce((query, params, cb) => {
      cb(null, []);
    });

    const res = await request(app).get('/api/pedidos/detalle/999');
    expect(res.status).toBe(404);
  });

  test('PUT /api/pedidos/estatus/:idPedido actualiza estatus', async () => {
    connection.exec.mockImplementationOnce((query, params, cb) => {
      cb(null, { rowCount: 1 });
    });

    const res = await request(app)
      .put('/api/pedidos/estatus/123')
      .send({ estatusPedido: 'Entregado' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('PUT /api/pedidos/estatus/:idPedido rechaza estatus invalido', async () => {
    const res = await request(app)
      .put('/api/pedidos/estatus/123')
      .send({ estatusPedido: 'Cancelado' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
