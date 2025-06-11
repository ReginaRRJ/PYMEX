
//VentasCliente.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VentasCliente from '../pages/Client/VentasCliente';

const API_BASE_URL = 'http://localhost:3001';

describe('VentasCliente', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    // Limpia localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  test('muestra error si el idPyme no está en localStorage', async () => {
    // No ponemos idPyme en localStorage para simular error
    render(<VentasCliente />);
    // Esperamos que aparezca el error
    await waitFor(() => {
      expect(screen.getByText(/ID de PYME no disponible/i)).toBeInTheDocument();
    });
  });

  test('muestra error si el JSON de usuario está corrupto', async () => {
    localStorage.setItem('usuario', 'not-json');
    render(<VentasCliente />);
    await waitFor(() => {
      expect(screen.getByText(/Error al leer los datos de usuario/i)).toBeInTheDocument();
    });
  });

  test('fetch y muestra las ventas correctamente', async () => {
    // Seteamos usuario y token válido en localStorage
    localStorage.setItem('usuario', JSON.stringify({ idPyme: 123 }));
    localStorage.setItem('token', 'token123');

    const ventasMock = [
      {
        nombreSucursal: 'Sucursal 1',
        cantidadTotal: 10,
        fechaVenta: '2025-06-10',
        PRODUCTOSVENDIDOS: 'Producto A, Producto B',
        TOTALTICKETPRICE: '150.5',
      },
      {
        nombreSucursal: 'Sucursal 2',
        cantidadTotal: 5,
        fechaVenta: '2025-06-09',
        PRODUCTOSVENDIDOS: 'Producto C',
        TOTALTICKETPRICE: '75',
      },
    ];

    mockAxios.onGet(`${API_BASE_URL}/api/ventasClient/123`).reply(200, ventasMock);

    render(<VentasCliente />);

    // Espera a que se renderice la tabla con datos
    await waitFor(() => {
      expect(screen.getByText('Sucursal 1')).toBeInTheDocument();
      expect(screen.getByText('Producto A, Producto B')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('$150.50 MXN')).toBeInTheDocument();
      expect(screen.getByText('2025-06-10')).toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando la API retorna un formato incorrecto', async () => {
    localStorage.setItem('usuario', JSON.stringify({ idPyme: 123 }));
    localStorage.setItem('token', 'token123');

    // Retorna objeto en lugar de array
    mockAxios.onGet(`${API_BASE_URL}/api/ventasClient/123`).reply(200, { invalid: 'data' });

    render(<VentasCliente />);
    await waitFor(() => {
      expect(screen.getByText(/formato de datos de ventas recibido es incorrecto/i)).toBeInTheDocument();
    });
  });

  test('maneja errores del servidor correctamente', async () => {
    localStorage.setItem('usuario', JSON.stringify({ idPyme: 123 }));
    localStorage.setItem('token', 'token123');

    mockAxios.onGet(`${API_BASE_URL}/api/ventasClient/123`).reply(500, { message: 'Error interno' });

    render(<VentasCliente />);
    await waitFor(() => {
      expect(screen.getByText(/Error del servidor \(500\): Error interno/i)).toBeInTheDocument();
    });
  });

  test('maneja error de red cuando no hay respuesta del servidor', async () => {
    localStorage.setItem('usuario', JSON.stringify({ idPyme: 123 }));
    localStorage.setItem('token', 'token123');

    mockAxios.onGet(`${API_BASE_URL}/api/ventasClient/123`).networkError();

    render(<VentasCliente />);
    await waitFor(() => {
      expect(screen.getByText(/Error de red: No se recibió respuesta del servidor/i)).toBeInTheDocument();
    });
  });
});

