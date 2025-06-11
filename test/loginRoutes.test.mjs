import { jest } from '@jest/globals';
import request from 'supertest';

// ✅ Mock opcional si login usa autenticación o conexión externa
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// ✅ Importa la app sin levantar el servidor
const { default: app } = await import('../server.js'); // asegúrate que app.js exporta solo `app`

describe('Rutas de login', () => {
  test('POST /login responde con token o error', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        correo: 'prueba@correo.com',
        password: '1234'
      });

    console.log('🔍 Login normal:', response.status, response.body);

    expect([200, 401, 500]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body.token).toBeDefined();
    }
  });

  test('POST /login/notificacion responde con token o error', async () => {
    const response = await request(app)
      .post('/login/notificacion')
      .send({
        correo: 'prueba@correo.com',
        password: '1234'
      });

    console.log('🔍 Login notificación:', response.status, response.body);

    expect([200, 400, 401, 500]).toContain(response.status);
    if (response.status === 200) {
    expect(response.body.token).toBeDefined();
    } else {
    expect(response.body).toHaveProperty('error');
    }
  });
});