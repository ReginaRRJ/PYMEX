import { jest } from '@jest/globals';
import { makeReporteService } from '../services/reporteService.js';

describe('reporteService (con mocks inyectados)', () => {
  const mockCreate = jest.fn();
  const mockGet = jest.fn();
  const mockUpdate = jest.fn();

  const { createReporte, getReporte, updateReporte } = makeReporteService({
    createReportService: mockCreate,
    getReportService: mockGet,
    updateReportService: mockUpdate
  });

  test('createReporte debe retornar el nuevo reporte', async () => {
    const reporteMock = { titulo: 'Ejemplo' };
    mockCreate.mockResolvedValueOnce(reporteMock);

    const result = await createReporte(reporteMock);
    expect(result).toEqual(reporteMock);
  });

  test('createReporte lanza error si el servicio falla', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Error en creación'));

    await expect(createReporte({ titulo: 'x' })).rejects.toThrow('Error en creación');
  });

  test('getReporte debe retornar el reporte', async () => {
    const reporteMock = { id: 1, titulo: 'Reporte A' };
    mockGet.mockResolvedValueOnce(reporteMock);

    const result = await getReporte(1);
    expect(result).toEqual(reporteMock);
  });

  test('updateReporte debe retornar éxito', async () => {
    mockUpdate.mockResolvedValueOnce({ success: true });

    const result = await updateReporte(1, { titulo: 'Nuevo título' });
    expect(result).toEqual({ success: true });
  });
});