import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import process from 'process';
import LoginNavbar from "./components/LoginHeader";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try { 
      const response = await axios.post("http://localhost:3001/login", {
        correo: correo,
        hashContrasena: contrasena, 
      });
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      const { token, rol } = response.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      try {
        console.log("Login successful.");
        const notiResponse = await axios.post("http://localhost:3001/login/notificacion", {
          idUsuario: response.data.usuario.idUsuario,
        });
        console.log("Notificaciones correcto.", notiResponse.data);
        console.log("Se llamó al store procedure de notificaciones.");
      }
      catch (error) {
        console.error("Error configuraciones.:", error);
        alert("Error configuring notifications. Please try again later.");
      }
  
      if (rol === "Admin") {
        navigate("/admin");
      } else if (rol === "Cliente") {
        navigate("/client");
      } else if (rol === "Sucursal") {
        navigate("/sucursal");
      }else if (rol === "Proveedor") {
        navigate("/dist");
      } else if (rol === "Vendedor") {
        navigate("/vendedor");
      }else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error("Login fallido:", error);
      alert("Login fallido. Revise sus credenciales.");
    }
  };
  
  return (
    <>
    <div className="flex h-screen w-screen bg-white relative">
        <div className="absolute w-full h-[15%] z-50">
          <LoginNavbar />
        </div>

      <div className="bg-[url('/assets/sapBackground.jpg')] bg-cover bg-center h-screen w-3/5">
       
      </div>

      <div className="w-2/5 h-full bg-white flex items-center justify-center">
        <div className="w-[85%] h-[365px] flex flex-col items-start pl-10">
          <h1 className="text-3xl">Iniciar sesión</h1>
          <div className="w-[90%] h-[85%] bg-gray-100 rounded-xl pl-6 pt-6">
            <div className="w-[90%] h-full flex-col">
              <div className="w-full h-[80px] flex flex-col items-start">
                <h1>Correo</h1>
                <input
                  type="text"
                  className="w-full h-3/5 rounded-xl pl-2"
                  onChange={(e) => setCorreo(e.target.value)}
                  />
              </div>
              <br />
              <div className="w-full h-[80px] flex flex-col items-start">
                <h1>Contraseña</h1>
                <input
                  type="password"
                  className="w-full h-3/5 rounded-xl pl-2"
                  onChange={(e) => setContrasena(e.target.value)}
                  />
              </div>
              <br />
              <button
                id="login-button"
                className="w-full h-[40px] bg-blue-800 rounded-xl text-white"
                onClick={handleLogin}
                >
                Iniciar sesión
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <h1>¿No tienes cuenta?</h1>
            <h1 className="text-blue-500">Contactar a ventas</h1>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
