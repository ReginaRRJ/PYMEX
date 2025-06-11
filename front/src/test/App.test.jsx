//App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

describe('App component', () => {
  test('renderiza sin errores y muestra ToastContainer', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    const toastContainer = screen.getByRole('alert');
    expect(toastContainer).toBeInTheDocument();

    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });

  test('navega a la página About y renderiza About', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });

  test('navega a la página Home y renderiza Home', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});

