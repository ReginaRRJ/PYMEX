/*
// Login.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock de navigate
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should login and navigate to /admin for Admin role", async () => {
    const fakeUser = {
      idUsuario: 1,
      nombre: "Nancy",
    };

    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "fake-token",
          rol: "Admin",
          usuario: fakeUser,
        },
      })
      .mockResolvedValueOnce({
        data: { status: "success" }, // notificacion response
      });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token");
      expect(localStorage.getItem("rol")).toBe("Admin");
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  it("should show error alert when login fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "invalid@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login fallido. Revise sus credenciales.");
    });
  });

  it("should alert for unknown role", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "some-token",
          rol: "Desconocido",
          usuario: { idUsuario: 1 },
        },
      })
      .mockResolvedValueOnce({ data: {} });

    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Unknown role");
    });
  });
});

*/


import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock de navigate
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("axios");

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Helper para simular login exitoso y clic login
  const simulateLogin = async (role) => {
    const fakeUser = { idUsuario: 1, nombre: "Nancy" };

    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "fake-token",
          rol: role,
          usuario: fakeUser,
        },
      })
      .mockResolvedValueOnce({
        data: { status: "success" }, // notificacion response
      });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));
  };

  it("should login and navigate to /admin for Admin role", async () => {
    await simulateLogin("Admin");
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token");
      expect(localStorage.getItem("rol")).toBe("Admin");
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  it("should login and navigate to /client for Cliente role", async () => {
    await simulateLogin("Cliente");
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/client");
    });
  });

  it("should login and navigate to /sucursal for Sucursal role", async () => {
    await simulateLogin("Sucursal");
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/sucursal");
    });
  });

  it("should login and navigate to /dist for Proveedor role", async () => {
    await simulateLogin("Proveedor");
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/dist");
    });
  });

  it("should login and navigate to /vendedor for Vendedor role", async () => {
    await simulateLogin("Vendedor");
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/vendedor");
    });
  });

  it("should alert for unknown role", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "some-token",
          rol: "Desconocido",
          usuario: { idUsuario: 1 },
        },
      })
      .mockResolvedValueOnce({ data: {} });

    jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Unknown role");
    });
  });

  it("should show error alert when login fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Login failed"));

    jest.spyOn(window, "alert").mockImplementation(() => {});
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "invalid@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login fallido. Revise sus credenciales.");
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Login fallido:",
        expect.any(Error)
      );
    });
  });

  it("should handle error in notification request", async () => {
    const fakeUser = { idUsuario: 1, nombre: "Nancy" };

    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "fake-token",
          rol: "Admin",
          usuario: fakeUser,
        },
      })
      .mockRejectedValueOnce(new Error("Notification error"));

    jest.spyOn(window, "alert").mockImplementation(() => {});
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error configuraciones.:",
        expect.any(Error)
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Error configuring notifications. Please try again later."
      );
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/admin");
    });
  });
  it("should navigate correctly based on each role and alert unknown role otherwise", async () => {
  const rolesAndRoutes = [
    { rol: "Admin", ruta: "/admin" },
    { rol: "Cliente", ruta: "/client" },
    { rol: "Sucursal", ruta: "/sucursal" },
    { rol: "Proveedor", ruta: "/dist" },
    { rol: "Vendedor", ruta: "/vendedor" },
  ];

  for (const { rol, ruta } of rolesAndRoutes) {
    axios.post
      .mockResolvedValueOnce({
        data: {
          token: "fake-token",
          rol,
          usuario: { idUsuario: 1, nombre: "Nancy" },
        },
      })
      .mockResolvedValueOnce({ data: { status: "success" } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "nancy@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(ruta);
    });

    // Limpia mocks y render para la siguiente iteración
    jest.clearAllMocks();
  }

  // Caso rol desconocido
  axios.post
    .mockResolvedValueOnce({
      data: {
        token: "fake-token",
        rol: "NoExiste",
        usuario: { idUsuario: 1 },
      },
    })
    .mockResolvedValueOnce({ data: {} });

  jest.spyOn(window, "alert").mockImplementation(() => {});

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: "nancy@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByText(/iniciar sesión/i));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Unknown role");
  });
});

it("should send correct data in login request and save usuario in localStorage", async () => {
  const fakeUser = { idUsuario: 1, nombre: "Nancy" };

  axios.post.mockResolvedValueOnce({
    data: {
      token: "fake-token",
      rol: "Admin",
      usuario: fakeUser,
    },
  }).mockResolvedValueOnce({ data: { status: "success" } });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/correo/i), {
    target: { value: "nancy@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/contraseña/i), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByText(/iniciar sesión/i));

  await waitFor(() => {
    // Verifica que axios.post fue llamado con la URL y datos correctos
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/login",
      {
        correo: "nancy@example.com",
        hashContrasena: "123456",
      }
    );

    // Verifica que se guardó el usuario completo en localStorage
    expect(localStorage.getItem("usuario")).toBe(JSON.stringify(fakeUser));
  });
});


});
