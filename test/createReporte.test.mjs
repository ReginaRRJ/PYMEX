// test/createReporte.test.mjs
import { jest } from '@jest/globals';

// ✅ Paso 1: mocks manuales
const mockInput = jest.fn().mockReturnThis();
const mockQuery = jest.fn().mockResolvedValue({ rowsAffected: [1] });

const mockRequest = {
  input: mockInput,
  query: mockQuery
};

const mockConnect = jest.fn().mockResolvedValue({
  request: () => mockRequest
});

// ✅ Paso 2: mockear el módulo 'mssql'
jest.unstable_mockModule('mssql', () => ({
  default: {
    connect: mockConnect,
    NVarChar: 'NVarChar',
    Bit: 'Bit',
    Int: 'Int',
    DateTime: 'DateTime'
  }
}));

// ✅ Paso 3: importar módulo después del mock
//const sql = (await import('mssql')).default;
const { createReporte } = await import('../controllers/reporteAdminController.js');

describe('createReporte', () => {
  const mockReporte = {
    titulo: 'Error de sistema',
    descripcion: 'El sistema no arranca',
    urgencia: 'Alta',
    resuelto: false,
    detalleSolucion: '',
    fechaReporte: new Date(),
    fechaResolucion: null,
    idUsuario: 61,
    idPyme: 1
  };

  test('debe insertar un reporte correctamente', async () => {
    const result = await createReporte(mockReporte);

    // ✅ Validación estricta de que se usó el mock
    expect(mockConnect).toHaveBeenCalled();
    expect(mockInput).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(result).toHaveProperty('rowsAffected');
    expect(result.rowsAffected[0]).toBeGreaterThan(0);
  });

  test('debe manejar errores correctamente', async () => {
    // ❌ Sobrescribe temporalmente query para este test
    mockQuery.mockRejectedValueOnce(new Error('Error de base de datos'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await createReporte(mockReporte);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error creando reporte:'),
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});