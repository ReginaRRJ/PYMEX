//Profile.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";


describe("Profile component", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test("muestra Loading... si no hay usuario en localStorage", () => {
    render(<Profile />);
    // Debe mostrar el texto Loading...
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("muestra los datos del usuario si hay usuario en localStorage", () => {
    // Simula un usuario en localStorage
    const fakeUser = {
      nombreCompleto: "Juan Pérez",
      correo: "juan@example.com"
    };
    localStorage.setItem("usuario", JSON.stringify(fakeUser));

    render(<Profile />);
    
    // Espera que el nombre y correo aparezcan en pantalla
    expect(screen.getByText(fakeUser.nombreCompleto)).toBeInTheDocument();
    expect(screen.getByText(fakeUser.correo)).toBeInTheDocument();
  });

});
