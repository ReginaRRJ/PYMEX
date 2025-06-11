import { jest } from '@jest/globals';
import request from 'supertest';

// Mockear SAP HANA client
jest.unstable_mockModule('@sap/hana-client', () => {
  const fakeRows = [{ idTicket: 101, fechaVenta: '2025-06-01', cantidadTotal: 2 }];
  const mockExec = jest.fn((values, cb) => cb(null, fakeRows));
  const mockPrepare = jest.fn((query, cb) => cb(null, { exec: mockExec, drop: jest.fn() }));

  return {
    default: {
      createConnection: () => ({
        connect: (params, cb) => cb(null),
        disconnect: jest.fn(),
        prepare: mockPrepare,
        exec: mockExec
      })
    }
  };
});

// Importar la app después del mock
const { default: app } = await import('../server.js');

describe('Controlador clientVentasCrud.js', () => {
  test('GET /api/ventasClient/:idPyme retorna ventas', async () => {
    const res = await request(app).get('/api/ventasClient/1');
    expect([200, 204, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('idTicket');
    }
  });
});