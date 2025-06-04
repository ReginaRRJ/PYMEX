import React from "react";
import { useState } from "react";
import PedidosSucursal from "./PedidosSucursal";
import NotificacionesSucursal from "./NotificacionesSucursal";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";

import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';
import market from '/assets/market.png'
import stock from '/assets/stock.png'
import report from '/assets/report.png'

let rol = "SUCURSAL";

function SucursalMain() {
    const [activeScreenSucursal, setActiveScreenSucursal] = useState("pedidosSucursal");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        window.location.href = "/"; // Redirect to login page
    };

    const renderScreen = () => {
        switch (activeScreenSucursal) {
            case "pedidosSucursal":
                return <PedidosSucursal />;
            case "notificacionesSucursal":
                return <NotificacionesSucursal />;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (
        <div 
        id= "Navbar"
        className="w-screen h-screen flex flex-col items-center">
        <Header rol={rol} />
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
              <NavbarIcon
                icon={carrito}
                text={"Pedidos"}
                onClick={() => setActiveScreenSucursal("pedidosSucursal")}
                selected={activeScreenSucursal === "pedidosSucursal"}
              />
              <NavbarIcon
                
                icon={notificacion}
                text={"Notificaciones"}
                onClick={() => setActiveScreenSucursal("notificacionesSucursal")}
                selected={activeScreenSucursal === "notificacionesSucursal"}
              />
              <NavbarIcon
                icon={market}
                text={"Sucursales"}
                onClick={() => setActiveScreenSucursal("sucursalesSucursal")}
                selected={activeScreenSucursal === "sucursalesSucursal"}
              />
              <NavbarIcon
                icon={stock}
                text={"Stock"}
                onClick={() => setActiveScreenSucursal("stockSucursal")}
                selected={activeScreenSucursal === "stockSucursal"}
              />
              <NavbarIcon
                icon={report}
                text={"Reportar"}
                onClick={() => setActiveScreenSucursal("reportarSucursal")}
                selected={activeScreenSucursal === "reportarSucursal"}
              />
            </div>
            <div className="w-full h-[20%]">
              <Profile />
            </div>
          </div>
          {renderScreen()}
        </div>
      </div>
    );
}

export default SucursalMain;