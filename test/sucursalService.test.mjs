import { jest } from '@jest/globals';

jest.unstable_mockModule('../dbClient.js', async () => ({
  default: {
    exec: jest.fn().mockResolvedValue([
      { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'CDMX' },
      { idSucursal: 2, nombreSucursal: 'Sucursal B', ubicacionSucursal: 'GDL' }
    ])
  }
}));

const { getSucursalesPorPyme } = await import('../services/sucursalService.js');

test('getSucursalesPorPyme devuelve sucursales correctamente', async () => {
  const resultado = await getSucursalesPorPyme(1);
  expect(resultado).toEqual([
    { idSucursal: 1, nombreSucursal: 'Sucursal A', ubicacionSucursal: 'CDMX' },
    { idSucursal: 2, nombreSucursal: 'Sucursal B', ubicacionSucursal: 'GDL' }
  ]);
});