// Home.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Home from "../Home";

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe("Home component", () => {
  it("should render correctly and navigate on button click", () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Verifica que elementos clave estén en el documento
    expect(screen.getByText(/PYMEX/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();

    // Simula clic en el botón
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Verifica que navigate haya sido llamado con '/'
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
