// AddUser.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUser from '../pages/Admin/AddUser';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock axios y toast
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('AddUser Component', () => {
  beforeAll(() => {
    delete window.location;
    window.location = {
      reload: jest.fn(),
      // Si usas otras propiedades de location, las defines aquí para evitar errores
      href: '',
      assign: jest.fn(),
      replace: jest.fn(),
    };
  });

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crea usuario exitosamente', async () => {
    const onCloseMock = jest.fn();
    axios.post.mockResolvedValueOnce({ data: { message: 'Usuario creado' } });

    render(<AddUser onClose={onCloseMock} />);

    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByTestId('input-apellido'), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByTestId('input-contraseña'), { target: { value: '1234' } });

    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Usuario creado correctamente");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
