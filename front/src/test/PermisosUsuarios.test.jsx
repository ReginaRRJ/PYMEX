//PermisosUsuarios.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PermisosUsuarios from '../pages/Admin/PermisosUsuarios';
import axios from 'axios';

jest.mock('axios');

describe('PermisosUsuarios', () => {
  const mockUsuarios = [
    { nombreUsuario: 'Ana', correo: 'ana@test.com', rol: 'Admin' },
    { nombreUsuario: 'Luis', correo: 'luis@test.com', rol: 'Sucursal' },
  ];

  const defaultProps = {
    addUserModal: false,
    setAddUserModal: jest.fn(),
    editUserModal: false,
    setEditUserModal: jest.fn(),
    setUsuarioSeleccionado: jest.fn(),
  };

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza usuarios correctamente después del fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsuarios });

    render(<PermisosUsuarios {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Luis')).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error si el fetch falla', async () => {
    axios.get.mockRejectedValueOnce(new Error('Fallo al obtener usuarios'));

    render(<PermisosUsuarios {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/no se pudo obtener/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje si no hay usuarios', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<PermisosUsuarios {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron usuarios/i)).toBeInTheDocument();
    });
  });

  test('activa modal de edición y setea usuario al hacer clic en una fila', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsuarios });

    render(<PermisosUsuarios {...defaultProps} />);

    await waitFor(() => {
      const userRow = screen.getByText('Ana');
      fireEvent.click(userRow);
    });

    expect(defaultProps.setEditUserModal).toHaveBeenCalledWith(true);
    expect(defaultProps.setUsuarioSeleccionado).toHaveBeenCalledWith(mockUsuarios[0]);
  });

  test('activa modal de agregar usuario al hacer clic en el botón', async () => {
    axios.get.mockResolvedValueOnce({ data: mockUsuarios });

    render(<PermisosUsuarios {...defaultProps} />);

    const addButton = screen.getByRole('button', { name: /\+ agregar usuario/i });
    fireEvent.click(addButton);

    expect(defaultProps.setAddUserModal).toHaveBeenCalledWith(true);
  });
});
