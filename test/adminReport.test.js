import { jest } from '@jest/globals';

jest.unstable_mockModule('@sap/hana-client', () => {
  const mockExec = jest.fn((...args) => {
    const cb = args.at(-1); // Último argumento debe ser el callback
    cb(null, [{ mock: 'data' }]);
  });

  const mockConnect = jest.fn((params, cb) => cb(null));
  const mockDisconnect = jest.fn();

  return {
    default: {
      createConnection: () => ({
        connect: mockConnect,
        disconnect: mockDisconnect,
        exec: mockExec
      })
    }
  };
});

// Importar funciones luego del mock
const {
  createReporte,
  getAllReportes,
  updateResueltoReporte,
  getReporte,
  updateReporte
} = await import('../controllers/adminReport.js');

describe('adminReport controller', () => {
  const reporteMock = {
    titulo: 'Error en login',
    descripcion: 'No se puede iniciar sesión',
    urgencia: 'Alta',
    prioridad: 'Alta',
    fechaReporte: new Date(),
    resuelto: false,
    detalleSolucion: '',
    idUsuario: 2,
    idPyme: 1
  };

  test('createReporte debería insertar un nuevo reporte', async () => {
    const result = await createReporte(reporteMock);
    expect(result).toHaveProperty('message');
    expect(result.message).toMatch(/Reporte creado correctamente/);
  });

  test('getAllReportes debería retornar una lista de reportes', async () => {
    const result = await getAllReportes();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('mock');
  });

  test('updateResueltoReporte debería actualizar el campo resuelto', async () => {
    const result = await updateResueltoReporte(1, true);
    expect(result).toHaveProperty('message');
  });

  test('getReporte debería retornar un reporte por ID', async () => {
    const result = await getReporte(1);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('mock');
  });

  test('updateReporte debería actualizar un reporte completo', async () => {
    const result = await updateReporte(1, reporteMock);
    expect(result).toHaveProperty('message');
  });
});
