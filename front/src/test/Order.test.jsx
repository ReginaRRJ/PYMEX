
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddOrder from '../pages/Sucursal/AddOrder';
import axios from 'axios';
import { toast } from 'react-toastify';

jest.mock('axios');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AddOrder component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('proveedores')) {
        return Promise.resolve({
          data: [
            { idProveedor: 1, nombreProveedor: "Proveedor1" },
            { idProveedor: 2, nombreProveedor: "Proveedor2" }
          ]
        });
      }
      if (url.includes('productos')) {
        return Promise.resolve({
          data: [
            { idProducto: 1, nombreProducto: "Producto1" },
            { idProducto: 2, nombreProducto: "Producto2" }
          ]
        });
      }
      return Promise.reject(new Error('No mock for this url'));
    });

    axios.post.mockResolvedValue({
      data: { success: true },
    });
  });

  test('muestra proveedores y permite crear pedido', async () => {
    render(<AddOrder onClose={() => {}} />);

    // Esperar proveedores cargados
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Proveedor1' })).toBeInTheDocument()
    );

    // Seleccionar proveedor
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /nombre del proveedor/i }),
      'Proveedor1'
    );

    // Esperar productos cargados
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Producto1' })).toBeInTheDocument()
    );

    // Completar campos (usa getByLabelText si roles no funcionan)
    await userEvent.type(screen.getByLabelText(/nombre del proveedor/i), '5');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /tipo pedido/i }), 'Electrónica');
    await userEvent.type(screen.getByLabelText(/Teléfono/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/Correo/i), 'test@correo.com');

    // Click en crear
    await userEvent.click(screen.getByRole('button', { name: /crear/i }));

    // Verifica que el post fue llamado
    expect(axios.post).toHaveBeenCalled();

    // Verifica que se llamó toast success (si tu componente lo hace)
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Pedido creado correctamente");
    });
  });
});
