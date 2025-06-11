import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PedidosCliente from '../pages/Client/PedidosCliente';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
global.fetch = jest.fn();

describe('PedidosCliente', () => {
  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify({ idPyme: 1, idUsuario: 123 }));
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('actualiza estado del pedido exitosamente', async () => {
    // Simula respuesta exitosa de GET
    axios.get.mockResolvedValueOnce({
      data: [{
        ESTATUSCLIENTE: 'No autorizado',
        ESTATUSGENERALPEDIDO: 'Pendiente',
        nombreSucursal: 'Sucursal 1',
        nombreProductoo: 'Producto X',
        CANTIDADPEDIDO: 10,
        TOTALPEDIDOPRODUCTO: 100,
        idPedido: 1
      }]
    });

    // Simula respuesta exitosa de PUT
    axios.put.mockResolvedValueOnce({ status: 200, data: { message: "ok" } });

    // Simula fetch (stored procedure)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultado: [] }),
    });

    render(<PedidosCliente />);

    // Espera a que cargue el botón de autorizar
    const autorizarButton = await screen.findByRole('button', { name: /autorizar/i });
    expect(autorizarButton).toBeEnabled();

    // Haz clic en el botón para cambiar el estado del pedido
    userEvent.click(autorizarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3001/api/pedidosClient/1/estatusCliente',
        { estatusCliente: 'Autorizado' },
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        })
      );
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/notificaciones/actualizarCliente/1',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  test('maneja error al actualizar pedido', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{
        ESTATUSCLIENTE: 'No autorizado',
        ESTATUSGENERALPEDIDO: 'Pendiente',
        nombreSucursal: 'Sucursal 1',
        nombreProductoo: 'Producto X',
        CANTIDADPEDIDO: 10,
        TOTALPEDIDOPRODUCTO: 100,
        idPedido: 1
      }]
    });

    axios.put.mockRejectedValueOnce({
      response: { data: { message: 'Error al actualizar' } }
    });

    render(<PedidosCliente />);

    const autorizarButton = await screen.findByRole('button', { name: /autorizar/i });
    userEvent.click(autorizarButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    const errorText = await screen.findByText(/Error al actualizar/);
    expect(errorText).toBeInTheDocument();
  });
});
