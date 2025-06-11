//NotificacionesCliente.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NotificacionesCliente from "../pages/Client/NotificacionesCliente";

describe("NotificacionesCliente", () => {
  const mockUser = { idUsuario: 123, nombre: "Test User" };
  const mockToken = "fake-token";

  beforeEach(() => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "usuario") return JSON.stringify(mockUser);
      if (key === "token") return mockToken;
      return null;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("muestra mensaje de carga mientras user es null", () => {
    // Simulamos que no hay usuario en localStorage
    Storage.prototype.getItem.mockReturnValueOnce(null);
    render(<NotificacionesCliente />);
    expect(screen.getByText(/Cargando datos del usuario/i)).toBeInTheDocument();
  });

  test("carga configuracion de notificaciones y muestra switches activos", async () => {
    // Mock fetch GET para configuracion-notificaciones
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: () =>
          Promise.resolve([
            { idNotificacion: 7, activo: true },
            { idNotificacion: 8, activo: false },
            { idNotificacion: 9, activo: true },
            { idNotificacion: 10, activo: false },
          ]),
      })
    );

    render(<NotificacionesCliente />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3001/api/notificaciones/configuracion-notificaciones/${mockUser.idUsuario}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });

    // Verificamos que los switches reflejen los estados
    expect(screen.getByRole("checkbox", { name: /anticipación/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /automatización/i })).not.toBeChecked();
  });

  test("actualiza notificacion exitosamente al cambiar switch", async () => {
    // Mock fetch GET para obtener configuracion
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () =>
          Promise.resolve([
            { idNotificacion: 7, activo: false },
            { idNotificacion: 8, activo: false },
            { idNotificacion: 9, activo: false },
            { idNotificacion: 10, activo: false },
          ]),
      })
      // Mock fetch PUT para actualizar notificación
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(""),
      });

    render(<NotificacionesCliente />);

    // Esperamos que cargue la configuración inicial
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Cambiar el switch de idNotificacion 7 (anticipacion)
    const anticipacionSwitch = screen.getAllByRole("checkbox")[0];
    expect(anticipacionSwitch).not.toBeChecked();

    fireEvent.click(anticipacionSwitch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith(
        `http://localhost:3001/api/notificaciones/configuracion-notificaciones/${mockUser.idUsuario}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ idNotificacion: 7, activo: true }),
        })
      );
      expect(anticipacionSwitch).toBeChecked();
    });
  });

  test("rollback del switch si falla actualización", async () => {
    // Mock fetch GET
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: () =>
          Promise.resolve([
            { idNotificacion: 7, activo: false },
          ]),
      })
      // Mock fetch PUT que falla
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Error interno"),
      });

    window.alert = jest.fn();

    render(<NotificacionesCliente />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const anticipacionSwitch = screen.getAllByRole("checkbox")[0];
    expect(anticipacionSwitch).not.toBeChecked();

    fireEvent.click(anticipacionSwitch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      // El switch vuelve a estado false por rollback
      expect(anticipacionSwitch).not.toBeChecked();
      expect(window.alert).toHaveBeenCalledWith(
        "Error actualizando notificación. Por favor intente de nuevo"
      );
    });
  });
});
