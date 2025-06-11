import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginHeader from '../components/LoginHeader';
import { MemoryRouter } from 'react-router-dom';

// Mock del hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginHeader', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renderiza los botones de navegación y navega al hacer clic', () => {
    render(
      <MemoryRouter>
        <LoginHeader />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('Sobre Nosotros');
    const loginLink = screen.getByText('Iniciar sesión');

    // Simular clics
    fireEvent.click(homeLink);
    expect(mockNavigate).toHaveBeenCalledWith('/home');

    fireEvent.click(aboutLink);
    expect(mockNavigate).toHaveBeenCalledWith('/about');

    fireEvent.click(loginLink);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
