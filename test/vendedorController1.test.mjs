/*import { jest } from '@jest/globals';
import request from 'supertest';

// Mocks
const execMock = jest.fn((params, cb) => cb(null, [{ idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Centro' }]));
const prepareMock = jest.fn((query, cb) => cb(null, { exec: execMock }));
const connectMock = jest.fn((params, cb) => cb(null));

// ✅ Mock manual de @sap/hana-client sin usar `default`
jest.unstable_mockModule('@sap/hana-client', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn((params, cb) => cb(null)),
      prepare: jest.fn((query, cb) =>
        cb(null, {
          exec: jest.fn((params, cb2) => cb2(null, [{ id: 1 }])),
          drop: jest.fn(),
        })
      ),
      exec: jest.fn((query, cb) => cb(null, [{ result: 'ok' }])),
      disconnect: jest.fn(),
    })),
  };
});

// Cargar app después del mock
const appModule = await import('../server.js');
const app = appModule.default || appModule.app || appModule;

describe('vendedorController', () => {
  beforeEach(() => {
    execMock.mockClear();
    prepareMock.mockClear();
    connectMock.mockClear();
  });

  test('GET /api/vendedor/sucursales/:idPyme devuelve sucursales', async () => {
    const response = await request(app).get('/api/vendedor/sucursales/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Centro' }
    ]);
    expect(connectMock).toHaveBeenCalled();
    expect(prepareMock).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalledWith([1], expect.any(Function));
  });
});*/

import { jest } from '@jest/globals';
import request from 'supertest';

// Mock dinámico del cliente HANA
/*await jest.unstable_mockModule('@sap/hana-client', () => ({
  createConnection: () => ({
    connect: (params, cb) => cb(null),
    prepare: (query, cb) =>
      cb(null, {
        exec: (params, cb2) =>
          cb2(null, [
            { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Centro' },
          ]),
        drop: () => {},
      }),
    exec: (query, cb) => cb(null, [{ result: 'ok' }]),
    disconnect: () => {},
  }),
}));*/

await jest.unstable_mockModule('@sap/hana-client', () => ({
  __esModule: true, // 👈 Esto dice a Jest que es un módulo ES
  createConnection: () => ({
    connect: (params, cb) => cb(null),
    prepare: (query, cb) =>
      cb(null, {
        exec: (params, cb2) =>
          cb2(null, [
            { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Centro' }
          ]),
        drop: () => {}
      }),
    disconnect: () => {},
    exec: (query, cb) => cb(null, [])
  })
}));

// IMPORTANTE: Cargar app después del mock
/*const appModule = await import('../server.js');
const app = appModule.app || appModule.default || appModule;*/

const { default: app } = await import('../server.js');

describe('GET /api/vendedor/sucursales/:idPyme', () => {
  it('debe devolver las sucursales', async () => {
    const res = await request(app).get('/api/vendedor/sucursales/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Centro' },
    ]);
  });
});