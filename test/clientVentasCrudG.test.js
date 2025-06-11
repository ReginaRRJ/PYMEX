import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import {
  getSucursalesByPymeService,
  getProductsByBranch,
  createTicket,
  getTicketsByBranch,
  getSalesData
} from '../controllers/clientVentasCrud.js';

// Mock the @sap/hana-client module
const mockExec = jest.fn();
const mockPrepare = jest.fn((query, callback) => {
  callback(null, { exec: mockExec, drop: jest.fn() });
});
const mockConnect = jest.fn((params, callback) => {
  callback(null);
});
const mockDisconnect = jest.fn();
const mockExecDirect = jest.fn((query, callback) => {
  if (query === 'COMMIT') {
    callback(null);
  } else if (query === 'ROLLBACK') {
    callback(null);
  } else if (query === 'SELECT CURRENT_IDENTITY_VALUE() AS "idTicket" FROM DUMMY;') {
    callback(null, [{ idTicket: 1 }]);
  } else {
    callback(new Error('Unexpected direct exec query'));
  }
});


jest.mock('@sap/hana-client', () => ({
  createConnection: jest.fn(() => ({
    connect: mockConnect,
    prepare: mockPrepare,
    disconnect: mockDisconnect,
    exec: mockExecDirect, // For COMMIT, ROLLBACK, and CURRENT_IDENTITY_VALUE
  })),
}));


// Create a simple express app to test the controller functions
const app = express();
app.use(express.json());
app.get('/pyme/:idPyme/sucursales', getSucursalesByPymeService);
app.get('/branch/:idSucursal/products', getProductsByBranch);
app.post('/ticket', createTicket);
app.get('/branch/:idSucursal/tickets', getTicketsByBranch);
app.get('/pyme/:idPyme/sales', getSalesData);


describe('Controller Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('getSucursalesByPymeService', () => {
    const endpoint = '/pyme/123/sucursales';

    let consoleSpy;
    beforeEach(() => {
      jest.clearAllMocks();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('debe devolver sucursales para una pyme válida', async () => {
      const mockSucursales = [
        { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'Ubicación 1' },
        { idSucursal: 2, nombreSucursal: 'Sucursal B', ubicacionSucursal: 'Ubicación 2' },
      ];

      mockExec.mockImplementationOnce((params, callback) => callback(null, mockSucursales));

      const res = await request(app).get(endpoint);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSucursales);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith([123], expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    test.each([
      ['Error al conectar a la base de datos', mockConnect, 500, { error: 'Error al conectar a la base de datos' }],
      ['Error preparando consulta', mockPrepare, 500, { error: 'Error preparando consulta' }],
      ['Error ejecutando consulta', mockExec, 500, { error: 'Error ejecutando consulta' }],
    ])('maneja errores correctamente: %s', async (_, mockFn, status, expectedBody) => {
      mockFn.mockImplementationOnce((...args) => {
        const callback = args[args.length - 1];
        callback(new Error('Fallo simulado'));
      });

      const res = await request(app).get(endpoint);

      expect(res.statusCode).toBe(status);
      expect(res.body).toEqual(expectedBody);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // --- getProductsByBranch Tests ---
  describe('getProductsByBranch', () => {
    it('should return products for a given idSucursal', async () => {
      const mockProducts = [{
        idProducto: 101,
        nombreProductoo: 'Product A',
        precioProducto: 10.50,
        availableQuantity: 50
      }, {
        idProducto: 102,
        nombreProductoo: 'Product B',
        precioProducto: 20.00,
        availableQuantity: 30
      }, ];

      mockExec.mockImplementationOnce((params, callback) => {
        callback(null, mockProducts);
      });

      const res = await request(app).get('/branch/456/products');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockProducts);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith([456], expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle database connection error', async () => {
      mockConnect.mockImplementationOnce((params, callback) => {
        callback(new Error('Connection failed'));
      });

      const res = await request(app).get('/branch/456/products');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({
        error: 'Conexión con base de datos fallida.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).not.toHaveBeenCalled();
      expect(mockExec).not.toHaveBeenCalled();
      expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should handle query preparation error', async () => {
      mockPrepare.mockImplementationOnce((query, callback) => {
        callback(new Error('Prepare failed'));
      });

      const res = await request(app).get('/branch/456/products');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({
        error: 'Error preparando sentencia de base de datos.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).not.toHaveBeenCalled();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle query execution error', async () => {
      mockExec.mockImplementationOnce((params, callback) => {
        callback(new Error('Execution failed'));
      });

      const res = await request(app).get('/branch/456/products');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({
        error: 'Error ejecutando sentencia de base de datos.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  // --- createTicket Tests ---
  describe('createTicket', () => {
    it('should create a ticket and update inventory successfully', async () => {
      const requestBody = {
        idSucursal: 789,
        product: {
          idProducto: 101,
          precio: 15.00
        },
        cantidad: 2
      };

      // Mock sequence for createTicket:
      // 1. checkAvailabilityQuery (returns available quantity)
      // 2. insertTicketQuery (no direct return, just success)
      // 3. SELECT CURRENT_IDENTITY_VALUE() (returns new ticket ID)
      // 4. insertTicketProductQuery (no direct return, just success)
      // 5. updateAlmacenamientoQuery (no direct return, just success)
      // 6. COMMIT
      mockExec
        .mockImplementationOnce((params, callback) => { // checkAvailabilityQuery
          callback(null, [{
            cantidadProducto: 10
          }]);
        })
        .mockImplementationOnce((params, callback) => { // insertTicketQuery
          callback(null, {});
        })
        .mockImplementationOnce((params, callback) => { // insertTicketProductQuery
          callback(null, {});
        })
        .mockImplementationOnce((params, callback) => { // updateAlmacenamientoQuery
          callback(null, {});
        });

      mockExecDirect
        .mockImplementationOnce((query, callback) => { // SELECT CURRENT_IDENTITY_VALUE()
          callback(null, [{
            idTicket: 12345
          }]);
        })
        .mockImplementationOnce((query, callback) => { // COMMIT
          callback(null);
        });


      const res = await request(app)
        .post('/ticket')
        .send(requestBody);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        message: 'Ticket creado exitosamente',
        idTicket: 12345
      });

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(4); // check, insertTicket, insertTicketProduct, updateAlmacenamiento
      expect(mockExec).toHaveBeenCalledTimes(4);
      expect(mockExecDirect).toHaveBeenCalledWith('COMMIT', expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if required information is missing', async () => {
      const res = await request(app)
        .post('/ticket')
        .send({
          idSucursal: 1,
          product: {
            idProducto: 1,
            precio: 10
          },
          cantidad: 0
        }); // Invalid quantity

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: 'Información de ticket faltante o inválida.'
      });
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should return 404 if product not found in storage', async () => {
      mockExec.mockImplementationOnce((params, callback) => { // checkAvailabilityQuery
        callback(null, []); // No rows found
      });

      mockExecDirect.mockImplementationOnce((query, callback) => { // ROLLBACK
        callback(null);
      });

      const res = await request(app)
        .post('/ticket')
        .send({
          idSucursal: 789,
          product: {
            idProducto: 999,
            precio: 10.00
          },
          cantidad: 1
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({
        error: 'Producto no encontrado en la sucursal.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExecDirect).toHaveBeenCalledWith('ROLLBACK', expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if insufficient product quantity', async () => {
      mockExec.mockImplementationOnce((params, callback) => { // checkAvailabilityQuery
        callback(null, [{
          cantidadProducto: 1
        }]); // Only 1 available
      });

      mockExecDirect.mockImplementationOnce((query, callback) => { // ROLLBACK
        callback(null);
      });

      const res = await request(app)
        .post('/ticket')
        .send({
          idSucursal: 789,
          product: {
            idProducto: 101,
            precio: 15.00
          },
          cantidad: 5
        }); // Requesting 5, only 1 available

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: 'Cantidad de producto insuficiente. Sólo 1 dispinibles.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExecDirect).toHaveBeenCalledWith('ROLLBACK', expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should rollback and return 500 on database error during transaction', async () => {
      // Simulate an error during the insertTicketQuery step
      mockExec
        .mockImplementationOnce((params, callback) => { // checkAvailabilityQuery
          callback(null, [{
            cantidadProducto: 10
          }]);
        })
        .mockImplementationOnce((params, callback) => { // insertTicketQuery fails
          callback(new Error('DB error during ticket insertion'));
        });

      mockExecDirect.mockImplementationOnce((query, callback) => { // ROLLBACK
        callback(null);
      });


      const res = await request(app)
        .post('/ticket')
        .send({
          idSucursal: 789,
          product: {
            idProducto: 101,
            precio: 15.00
          },
          cantidad: 2
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({
        error: 'Transacción fallida: DB error during ticket insertion'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(2); // check, insertTicket
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExecDirect).toHaveBeenCalledWith('ROLLBACK', expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  // --- getTicketsByBranch Tests ---
  describe('getTicketsByBranch', () => {
    it('should return formatted tickets for a given idSucursal', async () => {
      const mockRawTickets = [{
        idTicket: 1,
        fechaVenta: '2023-01-10',
        cantidad: 2,
        productName: 'Laptop',
        precioProducto: 1000.00
      }, {
        idTicket: 1,
        fechaVenta: '2023-01-10',
        cantidad: 1,
        productName: 'Mouse',
        precioProducto: 25.00
      }, {
        idTicket: 2,
        fechaVenta: '2023-01-09',
        cantidad: 3,
        productName: 'Keyboard',
        precioProducto: 75.00
      }, ];

      const expectedFormattedTickets = [{
        idTicket: 1,
        fechaVenta: '2023-01-10',
        products: [{
          productName: 'Laptop',
          cantidad: 2,
          pricePerUnit: 1000,
          itemImporte: 2000
        }, {
          productName: 'Mouse',
          cantidad: 1,
          pricePerUnit: 25,
          itemImporte: 25
        }, ],
        totalImporte: '2025.00',
        totalQuantity: 3
      }, {
        idTicket: 2,
        fechaVenta: '2023-01-09',
        products: [{
          productName: 'Keyboard',
          cantidad: 3,
          pricePerUnit: 75,
          itemImporte: 225
        }, ],
        totalImporte: '225.00',
        totalQuantity: 3
      }, ];


      mockExec.mockImplementationOnce((params, callback) => {
        callback(null, mockRawTickets);
      });

      const res = await request(app).get('/branch/123/tickets');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(expectedFormattedTickets);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith([123], expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no tickets found', async () => {
      mockExec.mockImplementationOnce((params, callback) => {
        callback(null, []);
      });

      const res = await request(app).get('/branch/123/tickets');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith([123], expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle database connection error', async () => {
      mockConnect.mockImplementationOnce((params, callback) => {
        callback(new Error('Connection failed'));
      });

      const res = await request(app).get('/branch/123/tickets');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({
        error: 'Conexión con base de datos fallida.'
      });
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).not.toHaveBeenCalled();
      expect(mockExec).not.toHaveBeenCalled();
      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  // --- getSalesData Tests ---
  describe('getSalesData', () => {
    it('should return sales data for a given idPyme', async () => {
      const mockSalesData = [{
        idTicket: 1,
        fechaVenta: '2023-05-01',
        cantidadTotal: 5,
        nombreSucursal: 'Sucursal A',
        productosVendidos: 'Product X (3), Product Y (2)',
        totalTicketPrice: 150.00
      }, {
        idTicket: 2,
        fechaVenta: '2023-04-28',
        cantidadTotal: 1,
        nombreSucursal: 'Sucursal B',
        productosVendidos: 'Product Z (1)',
        totalTicketPrice: 75.00
      }, ];

      mockExec.mockImplementationOnce((params, callback) => {
        callback(null, mockSalesData);
      });

      const res = await request(app).get('/pyme/789/sales');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockSalesData);
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledWith([789], expect.any(Function));
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if idPyme is missing', async () => {
      const res = await request(app).get('/pyme/:idPyme/sales'); // No idPyme in URL

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('idPyme requerida.');
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should handle database connection error', async () => {
      mockConnect.mockImplementationOnce((params, callback) => {
        callback(new Error('Connection failed'));
      });

      const res = await request(app).get('/pyme/789/sales');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error conectando a SAP HANA');
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).not.toHaveBeenCalled();
      expect(mockExec).not.toHaveBeenCalled();
      expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should handle query preparation error', async () => {
      mockPrepare.mockImplementationOnce((query, callback) => {
        callback(new Error('Prepare failed'));
      });

      const res = await request(app).get('/pyme/789/sales');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error preparando la consulta de ventas');
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).not.toHaveBeenCalled();
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle query execution error', async () => {
      mockExec.mockImplementationOnce((params, callback) => {
        callback(new Error('Execution failed'));
      });

      const res = await request(app).get('/pyme/789/sales');

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('Error ejecutando la consulta de ventas');
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockPrepare).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});