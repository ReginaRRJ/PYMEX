//Sucursal.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import Sucursal from "../pages/Client/Sucursal";
import axios from "axios";

jest.mock("axios");

// Simula localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "token") return "fake-token";
    return null;
  });
});

describe("Sucursal.jsx", () => {
  const sucursalMock = {
    id: 1,
    ubicacion: "Sucursal Centro",
    ubicacion_completa: "Calle 123, Ciudad",
    unidades: 120
  };

  it("debe renderizar correctamente y mostrar ventas anuales", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ totalVentas: 50000 }]
    });

    render(<Sucursal sucursal={sucursalMock} mode="ventas" periodo="Ventas anuales" />);

    // Verifica render estático
    expect(screen.getByText("Sucursal Centro")).toBeInTheDocument();
    expect(screen.getByText("Calle 123, Ciudad")).toBeInTheDocument();

    // Espera a que se actualice montoVentas
    await waitFor(() => {
      expect(screen.getByText("$50,000 MXN")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3001/api/sucursal/ventas-anuales/1",
      expect.objectContaining({
        headers: { Authorization: "Bearer fake-token" }
      })
    );
  });

  it("debe renderizar unidades si el modo es 'unidades'", () => {
    render(<Sucursal sucursal={sucursalMock} mode="unidades" periodo="Ventas mensuales" />);
    expect(screen.getByText("120 unidades")).toBeInTheDocument();
  });

  it("debe manejar errores de API sin crashear", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Fallo en API"));

    render(<Sucursal sucursal={sucursalMock} mode="ventas" periodo="Ventas semanales" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error al cargar ventas de sucursal 1:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
