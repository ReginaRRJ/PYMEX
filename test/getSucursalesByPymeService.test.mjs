import { jest } from '@jest/globals';

// 👇 MOCK: intercepta llamadas a dbClient y regresa datos ficticios
jest.unstable_mockModule('../dbClient.js', () => ({
  default: {
    exec: jest.fn().mockResolvedValue([
      { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'CDMX' },
      { idSucursal: 2, nombreSucursal: 'Sucursal B', ubicacionSucursal: 'GDL' }
    ])
  }
}));

// 👇 Importa después de mockear dbClient
const { getSucursalesByPymeService } = await import('../services/sucursalService.js');

test('getSucursalesByPymeService debe devolver la lista de sucursales', async () => {
  const req = { params: { idPyme: 1 } };

  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  await getSucursalesByPymeService(req, res);

  expect(res.json).toHaveBeenCalledWith([
    { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'CDMX' },
    { idSucursal: 2, nombreSucursal: 'Sucursal B', ubicacionSucursal: 'GDL' }
  ]);
});