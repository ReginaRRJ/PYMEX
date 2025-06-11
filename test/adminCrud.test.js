// adminCrud.test.js
import { jest } from '@jest/globals';

// Mock para @sap/hana-client
jest.unstable_mockModule('@sap/hana-client', () => {
  const mockExec = jest.fn((queryOrValues, cb) => cb(null, [{ idUsuario: 1, nombreUsuario: 'Test' }]));
  const mockDrop = jest.fn();
  const mockPrepare = jest.fn((query, cb) => cb(null, { exec: mockExec, drop: mockDrop }));
  const mockConnect = jest.fn((params, cb) => cb(null));
  const mockDisconnect = jest.fn();

  return {
    default: {
      createConnection: () => ({
        connect: mockConnect,
        disconnect: mockDisconnect,
        exec: mockExec,
        prepare: mockPrepare
      })
    }
  };
});

// Importaciones reales luego del mock
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = await import('../controllers/adminCrud.js');

describe('adminCrud controller', () => {
  test('getUsuarios debe retornar una lista de usuarios', async () => {
    const usuarios = await getUsuarios();
    expect(Array.isArray(usuarios)).toBe(true);
    expect(usuarios[0]).toHaveProperty('idUsuario');
  });

  test('createUsuario debe insertar un nuevo usuario', async () => {
    const result = await createUsuario({
      nombreUsuario: 'Juan',
      apellidoUsuario: 'Pérez',
      rol: 'admin',
      correo: 'juan@test.com',
      contrasena: '1234',
      hashContrasena: 'abcd1234abcd1234',
      idPyme: 1
    });
    expect(result).toBeDefined();
  });

  test('updateUsuario debe actualizar un usuario por ID', async () => {
    const result = await updateUsuario(1, {
      nombreUsuario: 'Juan',
      apellidoUsuario: 'Pérez',
      rol: 'admin',
      correo: 'juan@test.com',
      idPyme: 1
    });
    expect(result).toBeDefined();
  });

  test('deleteUsuario debe eliminar un usuario por ID', async () => {
    const result = await deleteUsuario(1);
    expect(result).toBeDefined();
  });
});