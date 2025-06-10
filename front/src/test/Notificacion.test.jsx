import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from '../components/Notification';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock de axios
jest.mock('axios');

describe('Notification component', () => {
  const mockNotification = {
    idMensaje: 1,
    tipoNotificacion: 'Alerta',
    mensaje: 'Tienes una nueva alerta',
    fecha: '2025-06-09',
    leida: false,
  };

  const mockOnMarkedRead = jest.fn();

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    mockOnMarkedRead.mockClear();
    axios.put.mockReset();
  });

  test('renderiza el contenido de la notificación', () => {
    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);

    expect(screen.getByText('Alerta')).toBeInTheDocument();
    expect(screen.getByText('Tienes una nueva alerta')).toBeInTheDocument();
    expect(screen.getByText('2025-06-09')).toBeInTheDocument();
  });

  test('marca la notificación como leída al hacer clic y llama a onMarkedRead', async () => {
    axios.put.mockResolvedValueOnce({ data: { leida: true } });

    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3001/notificaciones/notificacionLeida/1',
        {},
        {
          headers: { Authorization: 'Bearer mock-token' },
        }
      );
      expect(mockOnMarkedRead).toHaveBeenCalled();
    });
  });

  test('no llama a axios si ya estaba marcada como leída', () => {
    render(
      <Notification
        notification={{ ...mockNotification, leida: true }}
        onMarkedRead={mockOnMarkedRead}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();

    // No se dispara el evento porque el checkbox está deshabilitado
    expect(axios.put).not.toHaveBeenCalled();
    expect(mockOnMarkedRead).not.toHaveBeenCalled();
  });

  test('muestra error si no hay token en localStorage', async () => {
    localStorage.removeItem('token');
    axios.put.mockResolvedValueOnce({ data: { leida: true } });

    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled(); // No se hace la petición
      expect(mockOnMarkedRead).not.toHaveBeenCalled(); // No se llama a callback
    });
  });

  test('maneja errores si axios falla al marcar como leída', async () => {
    axios.put.mockRejectedValueOnce(new Error('Error de red'));

    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(mockOnMarkedRead).not.toHaveBeenCalled();
    });
  });
  test('no cambia estado si la respuesta no confirma lectura', async () => {
  axios.put.mockResolvedValueOnce({ data: { leida: false } });

  // Espiar console.warn
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);
  const checkbox = screen.getByRole('checkbox');

  fireEvent.click(checkbox);

  await waitFor(() => {
    expect(axios.put).toHaveBeenCalled();
    expect(mockOnMarkedRead).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "No se pudo marcar como leída:",
      { leida: false }
    );
  });

  warnSpy.mockRestore();
});

});


/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from '../components/Notification';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock de axios
jest.mock('axios');

describe('Notification component', () => {
  const mockNotification = {
    idMensaje: 1,
    tipoNotificacion: 'Alerta',
    mensaje: 'Tienes una nueva alerta',
    fecha: '2025-06-09',
    leida: false
  };

  const mockOnMarkedRead = jest.fn();

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    mockOnMarkedRead.mockClear();
  });

  test('renderiza el contenido de la notificación', () => {
    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);
    
    expect(screen.getByText('Alerta')).toBeInTheDocument();
    expect(screen.getByText('Tienes una nueva alerta')).toBeInTheDocument();
    expect(screen.getByText('2025-06-09')).toBeInTheDocument();
  });

  test('marca la notificación como leída al hacer clic y llama a onMarkedRead', async () => {
    axios.put.mockResolvedValueOnce({ data: { leida: true } });

    render(<Notification notification={mockNotification} onMarkedRead={mockOnMarkedRead} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3001/notificaciones/notificacionLeida/1',
        {},
        {
          headers: { Authorization: 'Bearer mock-token' },
        }
      );
      expect(mockOnMarkedRead).toHaveBeenCalled();
    });
  });

  test('no llama a axios si ya estaba marcada como leída', () => {
    render(
      <Notification
        notification={{ ...mockNotification, leida: true }}
        onMarkedRead={mockOnMarkedRead}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(axios.put).not.toHaveBeenCalled();
    expect(mockOnMarkedRead).not.toHaveBeenCalled();
  });
});
*/