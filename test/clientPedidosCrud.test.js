import { jest } from '@jest/globals';

jest.unstable_mockModule('@sap/hana-client', () => {
  const mockExec = jest.fn((values, callback) => {
    callback(null, [{ idPedido: 1, nombreSucursal: 'Sucursal Test' }]);
  });

  const mockPrepare = jest.fn((query, cb) => {
    cb(null, {
      exec: mockExec,
      drop: jest.fn()
    });
  });

  return {
    default: {
      createConnection: () => ({
        connect: (params, cb) => cb(null),
        disconnect: () => {},
        prepare: mockPrepare
      })
    }
  };
});

const { getPedidosByPyme } = await import('../controllers/clientPedidosCrud.js');

describe('clientePedidosCrud controller', () => {
  test('getPedidosByPyme debe retornar pedidos correctamente', async () => {
    const req = { params: { idPyme: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    await getPedidosByPyme(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ idPedido: 1 })
      ])
    );
  });
});