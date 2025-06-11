import { jest } from '@jest/globals';

// Mocks para todas las funciones internas de conexión
const mockExec = jest.fn((params, cb) => cb(null, [{ result: 'ok' }]));
const mockDrop = jest.fn();
const mockPrepare = jest.fn((sql, cb) =>
  cb(null, { exec: mockExec, drop: mockDrop })
);
const mockConnect = jest.fn((params, cb) => cb(null));
const mockDisconnect = jest.fn();

// Mock completo del módulo @sap/hana-client
await jest.unstable_mockModule('@sap/hana-client', () => ({
  createConnection: () => ({
    connect: mockConnect,
    prepare: mockPrepare,
    disconnect: mockDisconnect
  })
}));

// Importa el módulo después de aplicar el mock
const dbClient = (await import('../dbClient.js')).default;

describe('dbClient.exec', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ ejecuta una consulta exitosamente', async () => {
    const result = await dbClient.exec('SELECT * FROM test', ['param1']);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM test', expect.any(Function));
    expect(mockExec).toHaveBeenCalledWith(['param1'], expect.any(Function));
    expect(mockDrop).toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(result).toEqual([{ result: 'ok' }]);
  });

  it('❌ lanza error al conectar', async () => {
    mockConnect.mockImplementationOnce((_, cb) => cb(new Error('Fallo conexión')));
    await expect(dbClient.exec('SELECT * FROM test')).rejects.toThrow('Fallo conexión');
  });

  it('❌ lanza error al preparar', async () => {
    mockPrepare.mockImplementationOnce((_, cb) => cb(new Error('Fallo prepare')));
    await expect(dbClient.exec('SELECT * FROM test')).rejects.toThrow('Fallo prepare');
    expect(mockDisconnect).toHaveBeenCalled(); // se asegura desconexión
  });

  it('❌ lanza error al ejecutar', async () => {
    mockExec.mockImplementationOnce((_, cb) => cb(new Error('Fallo exec')));
    await expect(dbClient.exec('SELECT * FROM test', ['param'])).rejects.toThrow('Fallo exec');
    expect(mockDrop).toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('✅ ejecuta consulta sin parámetros explícitos', async () => {
    const result = await dbClient.exec('SELECT CURRENT_DATE');

    expect(mockConnect).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalledWith([], expect.any(Function)); // <- importante
    expect(result).toEqual([{ result: 'ok' }]);
   });
});