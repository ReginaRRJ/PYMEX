import { jest } from '@jest/globals';

// Mock dinámico correcto
jest.unstable_mockModule('../controllers/sucursalPedidos.js', () => ({
  getProveedores: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Proveedor Mock' }]),
  getProductoss: jest.fn().mockResolvedValue([{ id: 1, nombre: 'Mock Producto' }]),
  getProductosPorProveedor: jest.fn().mockResolvedValue([{ id: 2, nombre: 'Mock por Proveedor' }]),
  updatePedidoEstado: jest.fn().mockResolvedValue(),
  crearPedido: jest.fn().mockResolvedValue()
}));

const {
  getProductoss,
  getProductos,
  actualizarEstadoPedido,
  postCrearPedido
} = await import('../controllers/sucursalCrud.js');

test('getProductoss retorna productos', async () => {
  const req = {};
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

  await getProductoss(req, res);
  expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Mock Producto' }]);
});

test('getProductos por proveedor retorna productos', async () => {
  const req = { params: { idProveedor: 5 } };
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

  await getProductos(req, res);
  expect(res.json).toHaveBeenCalledWith([{ id: 2, nombre: 'Mock por Proveedor' }]);
});

test('actualizarEstadoPedido actualiza y responde correctamente', async () => {
  const req = { params: { idPedido: 10 }, body: { estatusProveedor: 'Curso' } };
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

  await actualizarEstadoPedido(req, res);
  expect(res.json).toHaveBeenCalledWith({ message: 'Pedido actualizado correctamente' });
});

test('postCrearPedido crea un pedido válido', async () => {
  const req = {
    body: {
      tipoPedido: 'Stock',
      cantidad: 5,
      fechaCreacion: '2025-06-09',
      fechaEntregaEstimada: '2025-06-10',
      fechaEntrega: '2025-06-10',
      idProveedor: 1,
      idProducto: 2,
      idSucursal: 3
    }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await postCrearPedido(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'Pedido creado correctamente' });
});