//VentasSucursal.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VentasSucursal from "../pages/Sucursal/VentasSucursal";
import '@testing-library/jest-dom';
import axios from "axios";

// Mock de axios
jest.mock("axios");

// Mock de localStorage
const mockUser = {
  idSucursal: "123",
};
beforeEach(() => {
  localStorage.setItem("usuario", JSON.stringify(mockUser));
  localStorage.setItem("token", "fake-token");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renderiza correctamente y cambia intervalo de ventas", async () => {
  axios.get.mockResolvedValueOnce({
    data: [{ totalVentas: 50000 }],
  });

  render(<VentasSucursal />);

  // Verifica que seleccione "Ventas anuales" por default
  const select = screen.getByRole("combobox");
  expect(select.value).toBe("anual");

  // Espera a que cargue la venta
  await waitFor(() =>
    expect(screen.getByText("$50,000 MXN")).toBeInTheDocument()
  );

  // Cambiar a mensual
  axios.get.mockResolvedValueOnce({
    data: [{ totalVentas: 12000 }],
  });

  fireEvent.change(select, { target: { value: "mensual" } });

  await waitFor(() =>
    expect(screen.getByText("$12,000 MXN")).toBeInTheDocument()
  );
});

test("muestra '-' si no hay datos de ventas", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<VentasSucursal />);

  await waitFor(() => {
    expect(screen.getByText("$ -")).toBeInTheDocument();
  });
});

test("maneja error en el JSON de localStorage", () => {
  localStorage.setItem("usuario", "invalid JSON");

  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<VentasSucursal />);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test("maneja error al cargar ventas anuales", async () => {
  // Ventas inicial = "anual"
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  axios.get.mockRejectedValueOnce(new Error("Error al cargar ventas anuales"));

  render(<VentasSucursal />);

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al cargar ventas anuales:",
      expect.any(Error)
    );
  });

  consoleSpy.mockRestore();
});

test("maneja error al cargar ventas mensuales", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  axios.get.mockRejectedValueOnce(new Error("Error al cargar ventas mensuales"));

  render(<VentasSucursal />);

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "mensual" } });

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al cargar ventas mensuales:",
      expect.any(Error)
    );
  });

  consoleSpy.mockRestore();
});

test("maneja error al cargar ventas semanales", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  axios.get.mockRejectedValueOnce(new Error("Error al cargar ventas semanales"));

  render(<VentasSucursal />);

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "semanal" } });

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al cargar ventas semanales:",
      expect.any(Error)
    );
  });

  consoleSpy.mockRestore();
});

