//NotificacionesDist.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NotificacionesDist from '../pages/Distribuidor/NotificacionesDist';
import '@testing-library/jest-dom';

beforeEach(() => {
  // Mock localStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'usuario') {
      return JSON.stringify({ idUsuario: 123 });
    }
    if (key === 'token') {
      return 'mock-token';
    }
    return null;
  });

  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      headers: {
        get: () => "application/json"
      },
      json: () =>
        Promise.resolve([
          { idNotificacion: 4, activo: true },
          { idNotificacion: 5, activo: false },
          { idNotificacion: 6, activo: true }
        ])
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('NotificacionesDist', () => {
  test('renderiza el componente y muestra switches con valores correctos', async () => {
    render(<NotificacionesDist />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });

    const switchEntrega = screen.getByTestId('switchNotificacionEntrega');
    const switchAutomatizacion = screen.getByTestId('switchNotificacionAutomatizacion');

    expect(switchEntrega).toBeChecked(); // activo: true
    expect(switchAutomatizacion).not.toBeChecked(); // activo: false
  });

  test('actualiza el estado al hacer clic en los switches', async () => {
    render(<NotificacionesDist />);

    await waitFor(() => {
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });

    const switchEntrega = screen.getByTestId('switchNotificacionEntrega');
    expect(switchEntrega).toBeChecked();

    fireEvent.click(switchEntrega);

    // Se espera que el switch ahora esté apagado
    expect(switchEntrega).not.toBeChecked();

    // Verifica que se llamó a fetch con el método PUT
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/notificaciones/configuracion-notificaciones/123',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
          body: JSON.stringify({ idNotificacion: 4, activo: false })
        })
      );
    });
  });
});
