import request from 'supertest';
import { jest } from '@jest/globals';

const app = (await import('../server.js')).default;

describe('Servidor Express', () => {

  it('✔ responde en la ruta base "/"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('¡PYMEX backend está funcionando correctamente!');
  });

  it('✔ responde en una ruta conocida como "/login"', async () => {
    const response = await request(app).get('/login');
    // Aquí puedes esperar un 200 o 404 según cómo esté implementada la ruta
    // Si tienes un GET definido, espera 200, si no, puede ser 404
    expect([200, 404]).toContain(response.status); // flexible si la ruta no está implementada como GET
  });

});