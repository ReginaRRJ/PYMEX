// test/loginController.test.mjs
import { jest } from '@jest/globals';

// 🧪 1. Mocks antes de importar el módulo
const mockExec = jest.fn();
const mockPrepare = jest.fn((_sql, cb) => {
  cb(null, { exec: mockExec, drop: jest.fn() });
});

const mockConnect = jest.fn((params, cb) => cb(null));

const mockCreateConnection = jest.fn(() => ({
  connect: mockConnect,
  prepare: mockPrepare,
  disconnect: jest.fn()
}));

// 🧪 2. Mockeamos todo el módulo hana-client
jest.unstable_mockModule('@sap/hana-client', () => ({
  default: {
    createConnection: mockCreateConnection
  }
}));

// 🧪 3. Importamos el módulo real que se quiere testear
const { login } = await import('../controllers/loginController.js'); // ajusta si se llama distinto

describe('login', () => {
  it('devuelve token cuando las credenciales son válidas', async () => {
    const mockJson = {
      resultado: 'Autorizado',
      idUsuario: 1,
      correo: 'prueba@correo.com',
      nombreCompleto: 'Usuario Prueba',
      rol: 'cliente',
      idPyme: 2,
      nombrePyme: 'PYMEX',
      idSucursal: 10
    };

    mockExec.mockImplementation((params, cb) => {
      cb(null, [{ RESULTADO: JSON.stringify(mockJson) }]);
    });

    const req = {
      body: {
        correo: 'prueba@correo.com',
        hashContrasena: 'hash1234'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      rol: 'cliente',
      usuario: expect.objectContaining({ correo: 'prueba@correo.com' })
    }));
  });
});