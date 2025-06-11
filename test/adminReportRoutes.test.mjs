import { jest } from '@jest/globals';
import request from 'supertest';

// Mock del middleware para evitar verificación de token
jest.unstable_mockModule('../controllers/authMiddle.js', () => ({
  verifyToken: (req, res, next) => next()
}));

// Mock de funciones del controlador
const getAllReportesMock = jest.fn();
const updateResueltoReporteMock = jest.fn();
const createReporteMock = jest.fn();

jest.unstable_mockModule('../controllers/adminReport.js', () => ({
  getAllReportes: getAllReportesMock,
  updateResueltoReporte: updateResueltoReporteMock
}));

jest.unstable_mockModule('../controllers/reporteAdminController.js', () => ({
  createReporte: createReporteMock
}));

// Importar app después de los mocks
const { default: app } = await import('../server.js');

describe('Rutas de /reportes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /reportes devuelve todos los reportes', async () => {
    getAllReportesMock.mockResolvedValue([{ idReporte: 1, titulo: 'Reporte A' }]);

    const response = await request(app).get('/reportes');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ idReporte: 1, titulo: 'Reporte A' }]);
  });

  test('POST /reportes/pedido crea un nuevo reporte', async () => {
    const nuevo = {
      titulo: 'Error en pedido',
      descripcion: 'Descripción del error',
      prioridad: 'Alta'
    };
    createReporteMock.mockResolvedValue({ idReporte: 2, ...nuevo });

    const response = await request(app).post('/reportes/pedido').send(nuevo);
    expect(response.status).toBe(201);
    expect(response.body.titulo).toBe('Error en pedido');
  });

  test('POST /reportes/pedido falla si faltan campos', async () => {
    const incompleto = { descripcion: 'Falta título', prioridad: 'Media' };
    const response = await request(app).post('/reportes/pedido').send(incompleto);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('PUT /reportes/:id actualiza estado del reporte', async () => {
    updateResueltoReporteMock.mockResolvedValue({ success: true });
    const response = await request(app).put('/reportes/5').send({ resuelto: true });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});