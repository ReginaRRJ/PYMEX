import { jest } from '@jest/globals';

// Mock de hana-client
const mockExec = jest.fn();
const mockPrepare = jest.fn((query, cb) => cb(null, { exec: mockExec, drop: jest.fn() }));
const mockConnect = jest.fn((params, cb) => cb(null));
const mockDisconnect = jest.fn();

const mockConnection = {
  connect: mockConnect,
  exec: mockExec,
  prepare: mockPrepare,
  disconnect: mockDisconnect,
};

jest.unstable_mockModule('@sap/hana-client', () => ({
  default: {
    createConnection: () => mockConnection,
  }
}));

// Importa las funciones después del mock
const {
  getProveedores,
  getProductosPorProveedor,
  crearPedido,
  updatePedidoEstado,
  getProductoss
} = await import('../controllers/sucursalPedidos.js'); // ajusta ruta si es necesario

describe('Funciones de pedidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getProveedores retorna resultados', async () => {
    mockExec.mockImplementationOnce((query, cb) => cb(null, [{ idProveedor: 1 }]));
    const result = await getProveedores();
    expect(result).toEqual([{ idProveedor: 1 }]);
    expect(mockExec).toHaveBeenCalled();
  });

  test('getProductoss retorna resultados', async () => {
    mockExec.mockImplementationOnce((query, cb) => cb(null, [{ idProducto: 1 }]));
    const result = await getProductoss();
    expect(result).toEqual([{ idProducto: 1 }]);
    expect(mockExec).toHaveBeenCalled();
  });

  test('getProductosPorProveedor retorna productos filtrados', async () => {
    mockExec.mockImplementationOnce((params, cb) => cb(null, [{ idProducto: 1 }]));
    const result = await getProductosPorProveedor(1);
    expect(result).toEqual([{ idProducto: 1 }]);
    expect(mockPrepare).toHaveBeenCalled();
  });

  test('crearPedido inserta un pedido correctamente', async () => {
    mockExec.mockImplementationOnce((params, cb) => cb(null, { insertId: 100 }));
    const pedido = {
      tipoPedido: 'Normal',
      cantidad: 10,
      fechaCreacion: new Date(),
      fechaEntregaEstimada: new Date(),
      fechaEntrega: null,
      idProveedor: 1,
      idProducto: 1,
      idSucursal: 1,
      idUsuario: 1,
      estatusCliente: 'Pendiente',
      estatusProveedor: 'Pendiente'
    };
    const result = await crearPedido(pedido);
    expect(mockPrepare).toHaveBeenCalled();
    expect(result).toHaveProperty('insertId');
  });

  test('updatePedidoEstado actualiza correctamente', async () => {
    mockExec.mockImplementationOnce((params, cb) => cb(null, { success: true }));
    const result = await updatePedidoEstado(1, 'Entregado');
    expect(mockPrepare).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});