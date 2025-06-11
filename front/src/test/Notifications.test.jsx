import { render, screen, waitFor } from '@testing-library/react';
import Notificaciones from '../components/Notifications';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../components/Notification', () => ({ notification, onMarkedRead }) => (
  <div data-testid="mock-notification">
    {notification.mensaje}
    <button onClick={onMarkedRead}>Marcar como leída</button>
  </div>
));

// Mocks necesarios
beforeEach(() => {
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('usuario', JSON.stringify({ idUsuario: 1 }));
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          resultado: [
            { idMensaje: 101, mensaje: 'Alerta 1', leida: false },
            { idMensaje: 102, mensaje: 'Alerta 2', leida: true },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test('muestra notificaciones del usuario y permite marcarlas como leídas', async () => {
  const onCloseMock = jest.fn();

  render(<Notificaciones onClose={onCloseMock} />);

  // Espera a que se muestren las notificaciones
  await waitFor(() => {
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
  });

  // Verifica que se rendericen las notificaciones del mock
  expect(screen.getByText('Alerta 1')).toBeInTheDocument();
  expect(screen.getByText('Alerta 2')).toBeInTheDocument();

  // Simula clic para marcar como leída (vuelve a llamar a fetch)
  const marcarBtn = screen.getAllByText('Marcar como leída')[0];
  await userEvent.click(marcarBtn);
  expect(global.fetch).toHaveBeenCalledTimes(2); // Uno en useEffect, otro al marcar
});

test('muestra mensaje cuando no hay notificaciones', async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ resultado: [] }),
    })
  );

  render(<Notificaciones onClose={() => {}} />);
  await waitFor(() => {
    expect(screen.getByText('No hay notificaciones')).toBeInTheDocument();
  });
});
