//Header.test.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

// Mockeamos window.location
const originalLocation = window.location;
beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});
afterAll(() => {
  window.location = originalLocation;
});

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renderiza correctamente con campana y botón de logout', () => {
    const { getByText, getByAltText } = render(
      <Header
        rol="CLIENTE"
        bell={true}
        notificaciones={[]}
        setNotificationsModal={jest.fn()}
      />
    );

    expect(getByText('CLIENTE')).toBeInTheDocument();
    expect(getByText('Cerrar sesión')).toBeInTheDocument();
    expect(getByAltText('')).toBeInTheDocument(); // campana
  });

  test('cierra sesión correctamente al hacer click en botón', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('rol', 'CLIENTE');

    const { getByText } = render(
      <Header
        rol="CLIENTE"
        bell={false}
        notificaciones={[]}
        setNotificationsModal={jest.fn()}
      />
    );

    fireEvent.click(getByText('Cerrar sesión'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('rol')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  test('muestra punto rojo si hay notificaciones no leídas', () => {
    const { container } = render(
      <Header
        rol="CLIENTE"
        bell={true}
        notificaciones={[{ id: 1, read: false }]}
        setNotificationsModal={jest.fn()}
      />
    );

    const redDot = container.querySelector('.bg-red-500');
    expect(redDot).toBeInTheDocument();
  });

  test('activa setNotificationsModal al hacer click en campana', () => {
    const mockSetModal = jest.fn();
    const { container } = render(
      <Header
        rol="CLIENTE"
        bell={true}
        notificaciones={[]}
        setNotificationsModal={mockSetModal}
      />
    );

    const bellDiv = container.querySelector('div[onClick]');
    fireEvent.click(bellDiv);

    expect(mockSetModal).toHaveBeenCalledWith(true);
  });
});
