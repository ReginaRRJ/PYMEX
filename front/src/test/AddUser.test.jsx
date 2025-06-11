import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUser from '../pages/Admin/AddUser';
import axios from 'axios';
import { toast } from 'react-toastify';

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

  test('crea usuario exitosamente con rol Admin', async () => {
    const onCloseMock = jest.fn();
    axios.post.mockResolvedValueOnce({ data: { message: 'Usuario creado' } });

    render(<AddUser onClose={onCloseMock} />);

    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByTestId('input-apellido'), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByTestId('input-contraseña'), { target: { value: '1234' } });

    // El rol default es 'Admin'
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/usuarios/admin",
        expect.objectContaining({
          nombreUsuario: 'Juan',
          apellidoUsuario: 'Pérez',
          correo: 'juan@test.com',
          contrasena: '1234',
          rol: 'Admin',
          idPyme: '1',
        }),
        expect.any(Object) // headers
      );
      expect(onCloseMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Usuario creado correctamente");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('agrega sucursal sólo cuando el rol es Sucursal y activa input', async () => {
    render(<AddUser onClose={() => {}} />);

    // Cambiar rol a Sucursal
    fireEvent.change(screen.getByTestId('select-rol'), { target: { value: 'Sucursal' } });
    expect(screen.getByTestId('select-rol').value).toBe('Sucursal');

    // El select de sucursal debe estar habilitado
    const selectSucursal = screen.getByRole('combobox', { name: '' }) || screen.getByDisplayValue('');
    expect(selectSucursal).not.toBeDisabled();

    // Cambiar valor de sucursal y verificar que se actualiza
    fireEvent.change(selectSucursal, { target: { value: 'Sucursal1' } });
    expect(selectSucursal.value).toBe('Sucursal1');
  });

  test('crea usuario exitosamente con rol Sucursal y sucursal asignada', async () => {
    const onCloseMock = jest.fn();
    axios.post.mockResolvedValueOnce({ data: { message: 'Usuario creado' } });

    render(<AddUser onClose={onCloseMock} />);

    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByTestId('input-apellido'), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'ana@test.com' } });
    fireEvent.change(screen.getByTestId('input-contraseña'), { target: { value: '5678' } });

    // Cambiar rol a Sucursal
    fireEvent.change(screen.getByTestId('select-rol'), { target: { value: 'Sucursal' } });

    // Cambiar sucursal (suponemos que hay opciones o valor válido)
    const selectSucursal = screen.getByRole('combobox', { name: '' }) || screen.getByDisplayValue('');
    fireEvent.change(selectSucursal, { target: { value: 'Sucursal2' } });

    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/usuarios/admin",
        expect.objectContaining({
          nombreUsuario: 'Ana',
          apellidoUsuario: 'Gomez',
          correo: 'ana@test.com',
          contrasena: '5678',
          rol: 'Sucursal',
          idPyme: '1',
          sucursal: 'Sucursal2',
        }),
        expect.any(Object)
      );
      expect(onCloseMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Usuario creado correctamente");
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('muestra errores cuando faltan campos obligatorios', async () => {
    render(<AddUser onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error, por favor asigna un nombre");
    });

    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: 'Juan' } });
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error, por favor asigna un apellido");
    });

    fireEvent.change(screen.getByTestId('input-apellido'), { target: { value: 'Pérez' } });
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error, por favor asigna un correo");
    });

    fireEvent.change(screen.getByTestId('input-correo'), { target: { value: 'juan@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error, por favor asigna una contraseña");
    });

    // Cambiar rol a Sucursal para probar validación de sucursal obligatoria
    fireEvent.change(screen.getByTestId('select-rol'), { target: { value: 'Sucursal' } });
    fireEvent.change(screen.getByTestId('input-contraseña'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error, por favor asigna una sucursal");
    });
  });
});
