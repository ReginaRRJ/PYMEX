import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import process from 'process';


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
  
      // try {
      //   const response = await axios.post("http://localhost:3001/login", {
      //     correo,hashContrasena})
      //     .then(res=>{
      //       localStorage.setItem("usuario", JSON.stringify(res.data.usuario))
      //     });
      const { token, rol } = response.data;
  
      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
  
      // Redirect based on role
      if (rol === "Admin") {
        navigate("/admin");
      } else if (rol === "Cliente") {
        navigate("/client");
      } else if (rol === "Sucursal") {
        navigate("/sucursal");
      }else if (rol === "Proveedor") {
        navigate("/dist");
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  
  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="w-3/5 h-full bg-blue-700">
        <h1>Correo: {correo}</h1>
        <h1>Contraseña: {contrasena}</h1>
      </div>
      <div className="w-2/5 h-full bg-white flex items-center justify-center">
        <div className="w-4/5 h-[365px] flex flex-col items-start">
          <h1 className="text-3xl">Iniciar sesión</h1>
          <div className="w-4/5 h-[85%] bg-gray-100 rounded-xl pl-6 pt-6">
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
                className="w-full h-[40px] bg-blue-800 rounded-xl text-white"
                onClick={handleLogin}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
          <h1>¿No tienes cuenta? Contactar a ventas</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
