import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ Mock del middleware de autenticación
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Mock de las funciones del controlador
jest.unstable_mockModule('../controllers/adminCrud.js', () => ({
  getUsuarios: jest.fn(() => Promise.resolve([{ id: 1, nombre: 'Test' }])),
  createUsuario: jest.fn((usuario) => Promise.resolve({ mensaje: 'Usuario creado', usuario })),
  updateUsuario: jest.fn((id, usuario) => Promise.resolve({ mensaje: 'Usuario actualizado', id, usuario })),
  deleteUsuario: jest.fn((id) => Promise.resolve({ mensaje: 'Usuario eliminado', id }))
}));

// ✅ Importar app después de los mocks
const { default: app } = await import('../server.js');

describe('Rutas de CRUD de usuarios', () => {
  test('GET /api/usuarios devuelve lista de usuarios', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/usuarios/admin crea un usuario', async () => {
    const nuevoUsuario = { nombre: 'Nuevo', correo: 'nuevo@correo.com' };
    const res = await request(app).post('/api/usuarios/admin').send(nuevoUsuario);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('mensaje', 'Usuario creado');
  });

  test('PUT /api/usuarios/1 actualiza un usuario', async () => {
    const actualizado = { nombre: 'Actualizado' };
    const res = await request(app).put('/api/usuarios/1').send(actualizado);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Usuario actualizado');
  });

  test('DELETE /api/usuarios/1 elimina un usuario', async () => {
    const res = await request(app).delete('/api/usuarios/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Usuario eliminado');
  });
});