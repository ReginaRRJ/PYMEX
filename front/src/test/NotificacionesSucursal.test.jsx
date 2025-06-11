//NotificacionesSucursal.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificacionesSucursal from '../pages/Sucursal/NotificacionesSucursal';
import '@testing-library/jest-dom';


// Mock localStorage
beforeEach(() => {
  const user = { idUsuario: 123 };
  localStorage.setItem('usuario', JSON.stringify(user));
  localStorage.setItem('token', 'fake-token');
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

describe('NotificacionesSucursal', () => {
  test('renderiza el texto inicial y carga switches desde la API', async () => {
    // Mock fetch con JSON válido
    global.fetch = jest.fn().mockResolvedValue({
      headers: {
        get: () => 'application/json',
      },
      json: async () => [
        { idNotificacion: 1, activo: true },
        { idNotificacion: 2, activo: false },
        { idNotificacion: 3, activo: true }
      ],
    });

    render(<NotificacionesSucursal />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });

    const switch1 = screen.getByTestId('switchNotificacionAutorizado');
    const switch2 = screen.getByTestId('switchNotificacionAutorizacion');
    const switch3 = screen.getByTestId('switchNotificacionEstatus');

    expect(switch1).toBeChecked(); // true
    expect(switch2).not.toBeChecked(); // false
    expect(switch3).toBeChecked(); // true
  });

  test('no rompe si el response no es JSON (content-type inesperado)', async () => {
    const mockText = 'Not JSON';
    global.fetch = jest.fn().mockResolvedValue({
      headers: {
        get: () => 'text/html',
      },
      text: async () => mockText,
    });

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<NotificacionesSucursal />);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Expected JSON, but received:', mockText);
    });

    spy.mockRestore();
  });

  test('cambia switch y realiza fetch con método PUT', async () => {
    const user = { idUsuario: 123 };
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('token', 'fake-token');

    global.fetch = jest.fn()
      .mockResolvedValueOnce({ // Primer fetch: GET configuración
        headers: { get: () => 'application/json' },
        json: async () => [{ idNotificacion: 1, activo: false }],
      })
      .mockResolvedValueOnce({}); // Segundo fetch: PUT

    render(<NotificacionesSucursal />);

    const switch1 = await screen.findByTestId('switchNotificacionAutorizado');

    // Cambiar valor
    fireEvent.click(switch1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notificaciones/configuracion-notificaciones/123',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
          body: JSON.stringify({ idNotificacion: 1, activo: true }),
        })
      );
    });
  });
});
