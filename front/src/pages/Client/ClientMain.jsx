import React from "react";
import { useState } from "react";
import Header from "../../components/Header";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import PedidosCliente from "./PedidosCliente";
import VentasCliente from "./VentasCliente";
import NotificacionesCliente from "./NotificacionesCliente";
import SucursalesCliente from "./SucursalesCliente";
import StockCliente from "./StockCliente";
import ReporteCliente from "./ReporteCliente";
import Notificaciones from "../../components/Notifications";

import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';
import market from '/assets/market.png'
import stock from '/assets/stock.png'
import report from '/assets/report.png'
import sell from '/assets/sell.png'

let rol = "CLIENTE";

function ClientMain() {
    const [activeScreenCliente, setActiveScreenCliente] = useState("pedidosCliente");
    const [notModal, setNotModal] = useState(false)

    const renderScreen = () => {
        switch (activeScreenCliente) {
            case "pedidosCliente":
                return <PedidosCliente/>;
            case "ventasCliente":
                return <VentasCliente/>;
            case "notificacionesCliente":
                return <NotificacionesCliente/>;
            case "sucursalesCliente":
                return <SucursalesCliente/>;
            case "stockCliente":
                return <StockCliente/>;
            case "reporteCliente":
                return <ReporteCliente/>;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (
      <>
        {notModal && (
          <NotModalCliente onClose={() => setNotModal(false)}></NotModalCliente>
        )}

        <div className="w-screen h-screen flex flex-col items-center">
        <Header rol={rol} bell={true} setNotModal={setNotModal}/>
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
              <NavbarIcon
                icon={carrito}
                text={"Pedidos"}
                onClick={() => setActiveScreenCliente("pedidosCliente")}
                selected={activeScreenCliente === "pedidosCliente"}
              />
              <NavbarIcon
                icon={sell}
                text={"Ventas"}
                onClick={() => setActiveScreenCliente("ventasCliente")}
                selected={activeScreenCliente === "ventasCliente"}
              />
              <NavbarIcon
                icon={notificacion}
                text={"Notificaciones"}
                onClick={() => setActiveScreenCliente("notificacionesCliente")}
                selected={activeScreenCliente === "notificacionesCliente"}
              />
              <NavbarIcon
                icon={market}
                text={"Sucursales"}
                onClick={() => setActiveScreenCliente("sucursalesCliente")}
                selected={activeScreenCliente === "sucursalesCliente"}
              />
              <NavbarIcon
                icon={stock}
                text={"Stock"}
                onClick={() => setActiveScreenCliente("stockCliente")}
                selected={activeScreenCliente === "stockCliente"}
              />
              <NavbarIcon
                icon={report}
                text={"Reportar"}
                onClick={() => setActiveScreenCliente("reporteCliente")}
                selected={activeScreenCliente === "reporteCliente"}
              />
            </div>
            <div className="w-full h-[20%]">
              <Profile />
            </div>
          </div>
          <div className="w-[75%] h-full">
            {renderScreen()}
          </div>
        </div>
      </div>
    </>
    );
}

export default ClientMain;
