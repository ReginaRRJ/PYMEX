// VentasVendedor.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VentasVendedor from '../pages/Vendedor/VentasVendedor';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

// Mock de framer-motion (opcional si da problemas)
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>
  }
}));

describe('VentasVendedor', () => {
  const mockUser = {
    idSucursal: 123
  };

  beforeEach(() => {
    // Simular localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'usuario') return JSON.stringify(mockUser);
      if (key === 'token') return 'fake-token';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('muestra tickets correctamente', async () => {
    const mockTickets = [
      {
        idTicket: 1,
        fechaVenta: '2024-05-01',
        products: [
          { productName: 'Producto A', itemImporte: 120.5, cantidad: 2 },
          { productName: 'Producto B', itemImporte: 89.99, cantidad: 1 }
        ]
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockTickets });

    render(<VentasVendedor ventaModal={false} setVentaModal={jest.fn()} refreshTickets={false} />);

    // Esperar a que los tickets aparezcan en pantalla
    await waitFor(() => {
      expect(screen.getByText('Producto A')).toBeInTheDocument();
      expect(screen.getByText('Producto B')).toBeInTheDocument();
      expect(screen.getByText('$120.50 MXN')).toBeInTheDocument();
    });
  });

  test('muestra mensaje cuando no hay tickets', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<VentasVendedor ventaModal={false} setVentaModal={jest.fn()} refreshTickets={false} />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron ventas.')).toBeInTheDocument();
    });
  });

  test('maneja error en la petición de tickets', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<VentasVendedor ventaModal={false} setVentaModal={jest.fn()} refreshTickets={false} />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron ventas.')).toBeInTheDocument();
    });
  });

  test('hace toggle del modal al hacer clic en el botón', () => {
    const mockSetVentaModal = jest.fn();
    render(<VentasVendedor ventaModal={false} setVentaModal={mockSetVentaModal} refreshTickets={false} />);
    
    const boton = screen.getByText('+ Crear ticket');
    fireEvent.click(boton);
    expect(mockSetVentaModal).toHaveBeenCalledWith(true);
  });
});
