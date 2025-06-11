import { jest } from '@jest/globals';

const mockExec = jest.fn();
const mockPrepare = jest.fn((query, cb) => cb(null, { exec: mockExec, drop: jest.fn() }));
const mockConnect = jest.fn((params, cb) => cb(null));
const mockDisconnect = jest.fn();
const mockCreateConnection = jest.fn(() => ({
  connect: mockConnect,
  disconnect: mockDisconnect,
  prepare: mockPrepare
}));

jest.unstable_mockModule('@sap/hana-client', () => ({
  default: {
    createConnection: mockCreateConnection
  }
}));

const { getSucursalesByPymeService } = await import('../controllers/vendedorController.js');

describe('getSucursalesByPymeService', () => {
  beforeEach(() => {
    mockExec.mockReset();
    mockPrepare.mockClear();
    mockCreateConnection.mockClear();
  });

  test('responde con sucursales', async () => {
    const fakeRows = [{ idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Zona 1' }];
    mockExec.mockImplementation((params, cb) => cb(null, fakeRows));

    const req = { params: { idPyme: 42 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await getSucursalesByPymeService(req, res);

    expect(mockCreateConnection).toHaveBeenCalled();
    expect(mockPrepare).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalledWith([42], expect.any(Function));
    expect(res.json).toHaveBeenCalledWith(fakeRows);
  });

  test('responde con error si falla conexión', async () => {
    mockConnect.mockImplementationOnce((params, cb) => cb(new Error('Connection failed')));

    const req = { params: { idPyme: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getSucursalesByPymeService(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al conectar a la base de datos' });
  });
});