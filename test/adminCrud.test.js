// adminCrud.test.js
/*import { jest } from '@jest/globals';

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
});*/

// adminCrud.test.js
import { jest } from '@jest/globals';

// Mock base para @sap/hana-client
let mockExec, mockDrop, mockPrepare, mockConnect, mockDisconnect;

jest.unstable_mockModule('@sap/hana-client', () => {
  mockExec = jest.fn((queryOrValues, cb) => cb(null, [{ idUsuario: 1, nombreUsuario: 'Test' }]));
  mockDrop = jest.fn();
  mockPrepare = jest.fn((query, cb) => cb(null, { exec: mockExec, drop: mockDrop }));
  mockConnect = jest.fn((params, cb) => cb(null));
  mockDisconnect = jest.fn();

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

// Importaciones reales después del mock
const {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} = await import('../controllers/adminCrud.js');

describe('adminCrud controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  // Tests para errores no cubiertos
test('createUsuario debe fallar si exec lanza error', async () => {
  mockPrepare.mockImplementationOnce((_, cb) =>
    cb(null, {
      exec: (_, cb2) => cb2(new Error('exec error')),
      drop: jest.fn()
    })
  );

  await expect(createUsuario({
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    rol: 'admin',
    correo: 'juan@test.com',
    contrasena: '1234',
    hashContrasena: 'abcd1234abcd1234',
    idPyme: 1
  })).rejects.toMatch('Error ejecutando inserción: Error: exec error');
});

test('createUsuario debe fallar si la conexión falla', async () => {
  mockConnect.mockImplementationOnce((_, cb) => cb(new Error('connect error')));
  await expect(createUsuario({
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    rol: 'admin',
    correo: 'juan@test.com',
    contrasena: '1234',
    hashContrasena: 'abcd1234abcd1234',
    idPyme: 1
  })).rejects.toMatch('Error conectando a SAP HANA: Error: connect error');
});

test('createUsuario debe fallar si exec lanza error', async () => {
  mockPrepare.mockImplementationOnce((_, cb) => cb(null, {
    exec: (_, cb2) => cb2(new Error('exec error')),
    drop: jest.fn()
  }));
  await expect(createUsuario({
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    rol: 'admin',
    correo: 'juan@test.com',
    contrasena: '1234',
    hashContrasena: 'abcd1234abcd1234',
    idPyme: 1
  })).rejects.toMatch('Error ejecutando inserción: Error: exec error');
});

test('createUsuario debe fallar si prepare lanza error', async () => {
  mockPrepare.mockImplementationOnce((_, cb) =>
    cb(new Error('prepare error'), null)
  );

  await expect(createUsuario({
    nombreUsuario: 'Juan',
    apellidoUsuario: 'Pérez',
    rol: 'admin',
    correo: 'juan@test.com',
    contrasena: '1234',
    hashContrasena: 'abcd1234abcd1234',
    idPyme: 1
  })).rejects.toMatch('Error preparando la consulta: Error: prepare error');
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

test('updateUsuario debe lanzar error si falla exec', async () => {
  mockPrepare.mockImplementationOnce((_, cb) =>
    cb(null, {
      exec: (_, cb2) => cb2(new Error('Error al ejecutar')),
      drop: jest.fn()
    })
  );
  await expect(
    updateUsuario(1, {
      nombreUsuario: 'Juan',
      apellidoUsuario: 'Pérez',
      rol: 'admin',
      correo: 'juan@test.com',
      idPyme: 1
    })
  ).rejects.toMatch('Error ejecutando actualización: Error: Error al ejecutar');
});

test('updateUsuario debe fallar si prepare lanza error', async () => {
  mockPrepare.mockImplementationOnce((_, cb) => cb(new Error('prepare error')));
  await expect(
    updateUsuario(1, {
      nombreUsuario: 'Juan',
      apellidoUsuario: 'Pérez',
      rol: 'admin',
      correo: 'juan@test.com',
      idPyme: 1
    })
  ).rejects.toMatch('Error preparando consulta de actualización: Error: prepare error');
});

test('deleteUsuario debe eliminar un usuario por ID', async () => {
  const result = await deleteUsuario(1);
  expect(result).toBeDefined();
});

test('deleteUsuario debe lanzar error si falla exec', async () => {
  mockPrepare.mockImplementationOnce((_, cb) =>
    cb(null, {
      exec: (_, cb2) => cb2(new Error('Error en borrado')),
      drop: jest.fn()
      })
    );
    await expect(deleteUsuario(1)).rejects.toMatch('Error ejecutando borrado: Error: Error en borrado');
  });
});

test('deleteUsuario debe fallar si prepare lanza error', async () => {
  mockPrepare.mockImplementationOnce((_, cb) => cb(new Error('prepare error')));
  await expect(deleteUsuario(1)).rejects.toMatch(
    'Error preparando consulta de borrado: Error: prepare error'
  );
});

test('getUsuarios debe retornar una lista de usuarios', async () => {
  const usuarios = await getUsuarios();
  expect(Array.isArray(usuarios)).toBe(true);
  expect(usuarios[0]).toHaveProperty('idUsuario');
});

test('getUsuarios debe fallar si la conexión falla', async () => {
  mockConnect.mockImplementationOnce((_, cb) => cb(new Error('connect error')));
  await expect(getUsuarios()).rejects.toMatch('Error conectando a SAP HANA: Error: connect error');
});

test('getUsuarios debe fallar si exec lanza error', async () => {
  mockExec.mockImplementationOnce((_, cb) => cb(new Error('exec error')));
  await expect(getUsuarios()).rejects.toMatch('Error al obtener usuarios: Error: exec error');
});