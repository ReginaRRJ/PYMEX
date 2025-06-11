import { jest } from '@jest/globals';

// Mock dinámico del módulo adminCrud.js
jest.unstable_mockModule('../controllers/adminCrud.js', () => ({
  createUsuario: jest.fn().mockResolvedValue('usuario-creado'),
  getUsuario: jest.fn().mockResolvedValue({ id: 1, nombre: 'Juan' }),
  updateUsuario: jest.fn().mockResolvedValue('usuario-actualizado'),
  deleteUsuario: jest.fn().mockResolvedValue('usuario-eliminado')
}));

// Importar funciones con mocks aplicados
const {
  createUsuario,
  getUsuario,
  updateUsuario,
  deleteUsuario
} = await import('../controllers/usuarioCrudController.js');

const adminCrud = await import('../controllers/adminCrud.js');

describe('usuarioCrudController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUsuario retorna respuesta del servicio', async () => {
    const mockUsuario = { nombre: 'Nuevo' };
    const result = await createUsuario(mockUsuario);
    expect(adminCrud.createUsuario).toHaveBeenCalledWith(mockUsuario);
    expect(result).toBe('usuario-creado');
  });

  test('getUsuario retorna usuario esperado', async () => {
    const result = await getUsuario(1);
    expect(adminCrud.getUsuario).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, nombre: 'Juan' });
  });

  test('updateUsuario ejecuta correctamente', async () => {
    const updatedData = { correo: 'nuevo@test.com' };
    const result = await updateUsuario(2, updatedData);
    expect(adminCrud.updateUsuario).toHaveBeenCalledWith(2, updatedData);
    expect(result).toBe('usuario-actualizado');
  });

  test('deleteUsuario ejecuta correctamente', async () => {
    const result = await deleteUsuario(3);
    expect(adminCrud.deleteUsuario).toHaveBeenCalledWith(3);
    expect(result).toBe('usuario-eliminado');
  });

  test('createUsuario lanza error al fallar', async () => {
    adminCrud.createUsuario.mockRejectedValueOnce(new Error('Fallo'));
    await expect(createUsuario({})).rejects.toThrow('Fallo');
  });
});