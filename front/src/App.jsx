import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Login from "./Login";
import About from "./About";
import Home from "./Home";
import ClientMain from "./pages/Client/ClientMain";
import AdminMain from "./pages/Admin/AdminMain";
import SucursalMain from "./pages/Sucursal/SucursalMain";
import VendedorMain from "./pages/Vendedor/VendedorMain";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/client" element={<ClientMain />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/sucursal" element={<SucursalMain />} />
        <Route path="/vendedor" element={<VendedorMain />} />
      </Routes>
    </Router>
  )
}

export default App
