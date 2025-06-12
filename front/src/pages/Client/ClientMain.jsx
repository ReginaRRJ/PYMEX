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
import notificacionesData from "./notificaciones";
import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';
import market from '/assets/market.png'
import stock from '/assets/stock.png'
import report from '/assets/report.png'
import sell from '/assets/sell.png'
import analytics from '/assets/analytics.png'
import { toast } from 'react-toastify';
let rol = "CLIENTE";

function ClientMain() {
  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleClick = () => {
    openInNewTab('https://basic-trial-sac.cfapps.us10.hana.ondemand.com/sap/fpa/ui/tenants/f9f30/bo/story/2F309D041797F86B26437DA2F896C327');
  }

    const [activeScreenCliente, setActiveScreenCliente] = useState("pedidosCliente");
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [notificaciones, setNotificaciones] = useState(notificacionesData)

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
                return <h2>Pantalla no encontrada</h2>;
        }
    };

    return (
      <>
        {notificationsModal && (
          <Notificaciones onClose={() => setNotificationsModal(false)} notificaciones={notificaciones}></Notificaciones>
        )}

        <div className="w-screen h-screen flex flex-col items-center">
        <Header rol={rol} bell={true} notificaciones={notificaciones} setNotificationsModal={setNotificationsModal}/>
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div id="Navbar" className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
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
               <NavbarIcon
                icon={analytics}
                text={"Analiticas"}
                onClick={() => handleClick()}
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
