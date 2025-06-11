//StockCliente.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import StockCliente from "../pages/Client/StockCliente";
import axios from "axios";

jest.mock("axios");

describe("StockCliente", () => {
  const mockToken = "fake-token";
  const mockUser = JSON.stringify({ idPyme: 123 });
  const sucursalesResponse = [
    {
      idSucursal: 1,
      nombreSucursal: "Sucursal A",
      ubicacionSucursal: "Calle 123",
    },
    {
      idSucursal: 2,
      nombreSucursal: "Sucursal B",
      ubicacionSucursal: "Avenida 456",
    },
  ];

  const productosResponse = [
    { idProducto: "p1", nombreProductoo: "Producto 1" },
    { idProducto: "p2", nombreProductoo: "Producto 2" },
  ];

  beforeEach(() => {
    localStorage.setItem("token", mockToken);
    localStorage.setItem("usuario", mockUser);

    axios.get.mockImplementation((url) => {
      if (url.includes("/api/sucursales/pyme")) {
        return Promise.resolve({ data: sucursalesResponse });
      }
      if (url.includes("/api/sucursal/productos")) {
        return Promise.resolve({ data: productosResponse });
      }
      return Promise.reject(new Error("not found"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renderiza título y carga productos y sucursales", async () => {
    render(<StockCliente />);

    expect(screen.getByText("Stock")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Producto 1" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Producto 2" })).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox");
    expect(select.value).toBe("p1"); // Se selecciona el primer producto
    fireEvent.change(select, { target: { value: "p2" } });
    expect(select.value).toBe("p2");
  });
});
