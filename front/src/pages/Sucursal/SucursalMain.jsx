import React from "react";
import { useState } from "react";
import PedidosSucursal from "./PedidosSucursal";
import NotificacionesSucursal from "./NotificacionesSucursal";
import VentasSucursal from "./VentasSucursal";
import StockSucursal from "./StockSucursal";
import ReporteSucursal from "./ReporteSucursal";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import AddOrder from "./AddOrder";
import ActualizarPedido from "./ActualizarPedido";
import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';
import market from '/assets/market.png'
import stock from '/assets/stock.png'
import report from '/assets/report.png'

let rol = "SUCURSAL";

function SucursalMain() {
    const [activeScreenSucursal, setActiveScreenSucursal] = useState("pedidosSucursal");
    const [updateButton, setUpdateButton] = useState(false);
    const [newOrder, setNewOrder] = useState(false);
    const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);

    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    const idSucursal = storedUser?.idSucursal;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        window.location.href = "/"; // Redirect to login page
    };

    const abrirActualizarPedido = (idPedido) => {
      setPedidoSeleccionadoId(idPedido);
      console.log("ID del pedido seleccionado:", idPedido);
      setUpdateButton(true);
    };


    const renderScreen = () => {
        switch (activeScreenSucursal) {
            case "pedidosSucursal":
                return <PedidosSucursal 
                updateButton={updateButton}
                setUpdateButton={setUpdateButton}
                newOrder={newOrder}
                setNewOrder={setNewOrder}
                setPedidoSeleccionadoId={setPedidoSeleccionadoId}
                onActualizarPedido={abrirActualizarPedido}/>;
            case "notificacionesSucursal":
                return <NotificacionesSucursal />;
            case "ventasSucursal":
                return <VentasSucursal />;
            case "stockSucursal":
                return <StockSucursal />;
            case "reporteSucursal":
                return <ReporteSucursal />;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (

      <>
        {updateButton && //pedidoSeleccionadoId && 
        (
          <ActualizarPedido
            idPedido={pedidoSeleccionadoId}
            onClose={() => {
              setUpdateButton(false);
              setPedidoSeleccionadoId(null);
            }}
          />
        )}

        {newOrder && (
          <AddOrder onClose={() => setNewOrder(false)} />
        )}
      
        <div className="w-screen h-screen flex flex-col items-center">

        <Header rol={rol} />
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div id="Navbar" className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
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
                onClick={() => setActiveScreenSucursal("ventasSucursal")}
                selected={activeScreenSucursal === "ventasSucursal"}
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
                onClick={() => setActiveScreenSucursal("reporteSucursal")}
                selected={activeScreenSucursal === "reporteSucursal"}
              />
            </div>
            <div className="w-full h-[20%]">
              <Profile />
            </div>
          </div>
          {renderScreen()}
        </div>
      </div>
    </>
    );
}

export default SucursalMain;