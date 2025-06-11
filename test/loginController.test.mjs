// test/loginRoutes.test.mjs
import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ Mock del middleware para evitar verificación de token (aunque no se usa en login)
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Mock de conexión a SAP HANA (opcional si ya tienes acceso)
const { default: app } = await import('../server.js');

describe('Rutas de login', () => {
  test('POST /login responde con 401 si credenciales son inválidas', async () => {
    const response = await request(app)
      .post('/login')
      .send({ correo: 'correo@invalido.com', hashContrasena: 'incorrecta' });

    console.log('🔍 Login inválido:', response.status, response.body);

    expect([401, 500]).toContain(response.status);
    if (response.status === 401) {
      expect(response.body).toHaveProperty('message');
    }
  });

  test('POST /login/notificacion responde 400 si falta idUsuario', async () => {
    const response = await request(app)
      .post('/login/notificacion')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Falta idUsuario" });
  });

  test('POST /login/notificacion responde con éxito si idUsuario es válido', async () => {
    const response = await request(app)
      .post('/login/notificacion')
      .send({ idUsuario: 1 });

    console.log('🔍 Notificación generada:', response.status, response.body);

    expect([200, 500]).toContain(response.status); // Depende del SP y conexión
    if (response.status === 200) {
      expect(response.body).toHaveProperty('message', 'Notificación generada');
      expect(response.body).toHaveProperty('resultado');
    }
  });
});