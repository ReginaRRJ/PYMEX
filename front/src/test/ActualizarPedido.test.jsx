//ActualizarPedido.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActualizarPedido from '../Pages/Sucursal/ActualizarPedido';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('ActualizarPedido', () => {
  const mockOnClose = jest.fn();
  const mockIdPedido = 123;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock token en localStorage
    localStorage.setItem('token', 'fake-token');

    // Mock global fetch (para el llamado al stored procedure)
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  it('actualiza el pedido con éxito', async () => {
    axios.put.mockResolvedValueOnce({ data: { message: 'OK' } });

    render(<ActualizarPedido onClose={mockOnClose} idPedido={mockIdPedido} />);

    // Selecciona el botón "Actualizar" por rol y nombre (no solo por texto)
    const actualizarBtn = screen.getByRole('button', { name: /Actualizar/i });
    fireEvent.click(actualizarBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:3001/api/sucursal/pedido/${mockIdPedido}/estado`,
        { estatusProveedor: "Entregado" },
        { headers: { Authorization: 'Bearer fake-token' } }
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('muestra error si falla la actualización', async () => {
    axios.put.mockRejectedValueOnce(new Error('Error de red'));

    render(<ActualizarPedido onClose={mockOnClose} idPedido={mockIdPedido} />);

    const actualizarBtn = screen.getByRole('button', { name: /Actualizar/i });
    fireEvent.click(actualizarBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      // Aquí podrías verificar que aparezca el toast de error si usas mocks para toast
    });
  });

  it('dispara handleContentClick para evitar propagación', () => {
    render(<ActualizarPedido onClose={mockOnClose} idPedido={mockIdPedido} />);
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    // No debe cerrar el modal (no se debe llamar a onClose)
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('cierra el modal al hacer click fuera del contenido', () => {
    render(<ActualizarPedido onClose={mockOnClose} idPedido={mockIdPedido} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });
});

//HOLA
