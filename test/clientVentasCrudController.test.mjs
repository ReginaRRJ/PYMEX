import { jest } from '@jest/globals';

// Mock de @sap/hana-client con escenarios diversos
jest.unstable_mockModule('@sap/hana-client', () => {
  return {
    default: {
      createConnection: () => {
        let simulateError = false;
        let simulateEmpty = false;

        return {
          connect: (params, cb) => cb(simulateError ? new Error('Error de conexión') : null),
          disconnect: () => {},
          prepare: (query, cb) => {
            if (simulateError) return cb(new Error('Error preparando consulta'));
            cb(null, {
              exec: (params, cb2) => {
                if (simulateError) return cb2(new Error('Error ejecutando consulta'));
                cb2(null, simulateEmpty ? [] : [
                  { idSucursal: 1, nombreSucursal: 'Sucursal Uno', ubicacionSucursal: 'Centro' },
                  { idSucursal: 2, nombreSucursal: 'Sucursal Dos', ubicacionSucursal: 'Norte' }
                ]);
              },
              drop: () => {}
            });
          }
        };
      }
    }
  };
});

const { getSucursalesByPymeService } = await import('../controllers/clientVentasCrud.js');

describe('clientVentasCrud.js - getSucursalesByPymeService', () => {
  test('Responde con sucursales correctamente', async () => {
    const req = { params: { idPyme: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await getSucursalesByPymeService(req, res);
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ idSucursal: 1 }),
        expect.objectContaining({ idSucursal: 2 })
      ])
    );
  });

  test('Maneja error de conexión a SAP HANA', async () => {
    const req = { params: { idPyme: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockClient = (await import('@sap/hana-client')).default;
    mockClient.createConnection = () => ({
      connect: (p, cb) => cb(new Error('Error de conexión')),
      disconnect: () => {}
    });
    await getSucursalesByPymeService(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('Maneja error al preparar consulta', async () => {
    const req = { params: { idPyme: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockClient = (await import('@sap/hana-client')).default;
    mockClient.createConnection = () => ({
      connect: (p, cb) => cb(null),
      disconnect: () => {},
      prepare: (q, cb) => cb(new Error('Error preparando consulta'))
    });
    await getSucursalesByPymeService(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('Maneja error al ejecutar consulta', async () => {
    const req = { params: { idPyme: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockClient = (await import('@sap/hana-client')).default;
    mockClient.createConnection = () => ({
      connect: (p, cb) => cb(null),
      disconnect: () => {},
      prepare: (q, cb) => cb(null, {
        exec: (params, cb2) => cb2(new Error('Error ejecutando consulta')),
        drop: () => {}
      })
    });
    await getSucursalesByPymeService(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
