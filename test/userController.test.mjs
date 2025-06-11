import { jest } from '@jest/globals';

// Mockear conexión DB y bcrypt
jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    exec: jest.fn(),
    prepare: jest.fn()
  }
}));
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn().mockResolvedValue('hashed123')
  }
}));

const connection = (await import('../config/db.js')).default;
const bcrypt = (await import('bcryptjs')).default;
const { getUsers, createUser, updateUser, deleteUser } = await import('../controllers/userController.js');

describe('userController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUsers retorna usuarios', async () => {
    const mockUsers = [{ id: 1, nombreUsuario: 'test' }];
    connection.exec.mockImplementation((query, params, callback) => callback(null, mockUsers));

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await getUsers(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('createUser crea un usuario', async () => {
    connection.exec.mockImplementation((query, params, callback) => callback(null, { affectedRows: 1 }));

    const req = { body: { username: 'user', email: 'user@test.com', password: '1234' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createUser(req, res);
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario creado exitosamente' });
  });

  test('updateUser actualiza correctamente', async () => {
    connection.exec.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const req = { params: { id: 1 }, body: { username: 'nuevo' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario actualizado exitosamente' });
  });

  test('updateUser sin cambios retorna 400', async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nada que actualizar' });
  });

  test('deleteUser elimina usuario', async () => {
    const statementMock = {
      exec: (args, callback) => callback(null, [{}])
    };
    connection.prepare.mockImplementation((query, callback) => callback(null, statementMock));

    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario eliminado exitosamente' });
  });

  test('deleteUser usuario no encontrado', async () => {
    const statementMock = {
      exec: (args, callback) => callback(null, [])
    };
    connection.prepare.mockImplementation((query, callback) => callback(null, statementMock));

    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });
});