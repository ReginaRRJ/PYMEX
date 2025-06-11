// tests/EditUser.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUser from "../../src/pages/Admin/EditUser";
import axios from "axios";
import { toast } from "react-toastify";

// Mocks
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock de crypto.subtle.digest
global.crypto = {
  subtle: {
    digest: jest.fn().mockResolvedValue(
      new Uint8Array([0x12, 0x34, 0xab]).buffer
    ),
  },
};

describe("EditUser Component", () => {
  const mockUser = {
    idUsuario: 1,
    idPyme: 123,
    nombreUsuario: "Nancy",
    apellidoUsuario: "Silva",
    correo: "nancy@test.com",
    contrasena: "secreta",
    hashContrasena: "1234abcd",
    rol: "Sucursal",
    sucursal: "Sucursal A"
  };

  const mockClose = jest.fn();

  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    jest.clearAllMocks();
  });

  test("hace hash y actualiza usuario con sucursal", async () => {
    axios.put.mockResolvedValue({ data: { success: true } });

    render(<EditUser user={mockUser} onClose={mockClose} />);

    // Asegura que el cambio de rol dispara setSelectedRole
    const selectRol = screen.getByDisplayValue("Sucursal");
    fireEvent.change(selectRol, { target: { value: "Sucursal" } });

    const updateButton = screen.getByText("Actualizar");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(crypto.subtle.digest).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3001/api/usuarios/1",
        expect.objectContaining({
          nombreUsuario: "Nancy",
          correo: "nancy@test.com",
          apellidoUsuario: "Silva",
          rol: "Sucursal",
          idPyme: 123,
          id: 1,
          sucursal: "Sucursal A"
        }),
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-token" }
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Usuario actualizado correctamente");
      expect(mockClose).toHaveBeenCalled();
    });
  });

  test("muestra error si axios.put falla", async () => {
    axios.put.mockRejectedValue(new Error("Error al actualizar"));

    render(<EditUser user={mockUser} onClose={mockClose} />);

    const updateButton = screen.getByText("Actualizar");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error al actualizar usuario.");
    });
  });

  test("hace hash y elimina usuario", async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });

    render(<EditUser user={mockUser} onClose={mockClose} />);

    const deleteButton = screen.getByText("Eliminar");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(crypto.subtle.digest).toHaveBeenCalled();
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3001/api/usuarios/1",
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-token" }
        })
      );
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
