/*await jest.unstable_mockModule('../Classes/ReportFollowUpClass.js', () => ({
  default: class {},
}));

import { jest } from '@jest/globals';

// Mock de sql
const inputMock = jest.fn().mockReturnThis();
const queryMock = jest.fn().mockResolvedValue({ rowsAffected: [1] });

const requestMock = jest.fn(() => ({
  input: inputMock,
  query: queryMock,
}));

const connectMock = jest.fn().mockResolvedValue({
  request: requestMock,
});

// Mockear módulo mssql
await jest.unstable_mockModule('mssql', () => ({
  default: {
    connect: connectMock,
    NVarChar: 'NVarChar',
    Bit: 'Bit',
    DateTime: 'DateTime',
  }
}));

// Importar después del mock
const { createReporte } = await import('../controllers/clientReport.js');

describe('createReporte', () => {
  it('inserta un reporte correctamente', async () => {
    const fakeReporte = {
      titulo: 'Fallo de conexión',
      descripcion: 'No hay internet en la oficina',
      urgencia: 'Alta',
      resuelto: false,
      detallesResolucion: '',
      fechaReporte: new Date('2024-01-01T10:00:00'),
      fechaResolucion: null
    };

    const result = await createReporte(fakeReporte);

    expect(connectMock).toHaveBeenCalled();
    expect(requestMock).toHaveBeenCalled();

    expect(inputMock).toHaveBeenCalledWith('titulo', 'NVarChar', fakeReporte.titulo);
    expect(inputMock).toHaveBeenCalledWith('descripcion', 'NVarChar', fakeReporte.descripcion);
    expect(inputMock).toHaveBeenCalledWith('urgencia', 'NVarChar', fakeReporte.urgencia);
    expect(inputMock).toHaveBeenCalledWith('resuelto', 'Bit', fakeReporte.resuelto);
    expect(inputMock).toHaveBeenCalledWith('detallesResolucion', 'NVarChar', fakeReporte.detallesResolucion);
    expect(inputMock).toHaveBeenCalledWith('fechaReporte', 'DateTime', fakeReporte.fechaReporte);
    expect(inputMock).toHaveBeenCalledWith('fechaResolucion', 'DateTime', fakeReporte.fechaResolucion);

    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO Reportes'));

    expect(result).toEqual({ rowsAffected: [1] });
  });
});*/

import { jest } from '@jest/globals';

// ✅ MOCK antes de importar createReporte
const inputMock = jest.fn().mockReturnThis();
const queryMock = jest.fn().mockResolvedValue({ rowsAffected: 1 });
const requestMock = jest.fn(() => ({
  input: inputMock,
  query: queryMock,
}));
const connectMock = jest.fn(() => ({
  request: requestMock,
}));

// ⬅ Mock del módulo completo de mssql
await jest.unstable_mockModule('mssql', () => ({
  default: {
    connect: connectMock,
    NVarChar: 'NVarChar',
    Bit: 'Bit',
    DateTime: 'DateTime',
  }
}));

// ✅ mock de clase si es necesario
await jest.unstable_mockModule('../Classes/ReportFollowUpClass.js', () => ({
  default: class {},
}));

// ✅ Importar después de mockear
const { createReporte } = await import('../controllers/clientReport.js');

describe('createReporte', () => {
  it('inserta un reporte correctamente', async () => {
    const fakeReporte = {
      titulo: 'Reporte de prueba',
      descripcion: 'Descripción',
      urgencia: 'Alta',
      resuelto: false,
      detallesResolucion: 'Pendiente',
      fechaReporte: new Date(),
      fechaResolucion: null,
    };

    const result = await createReporte(fakeReporte);

    expect(connectMock).toHaveBeenCalled();
    expect(requestMock).toHaveBeenCalled();
    expect(inputMock).toHaveBeenCalledWith('titulo', 'NVarChar', fakeReporte.titulo);
    expect(queryMock).toHaveBeenCalled();
    expect(result).toEqual({ rowsAffected: 1 });
  });
  it('❌ maneja errores correctamente', async () => {
    // Fuerza a que connect falle (como función async que lanza error)
    connectMock.mockImplementationOnce(async () => {
        throw new Error('Falló la conexión');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await createReporte({});

    expect(connectMock).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
        'Error creando reporte:',
        expect.any(Error)
    );

    consoleSpy.mockRestore();
    });
});


