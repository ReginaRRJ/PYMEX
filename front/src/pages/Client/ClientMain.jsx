import React from "react";
import { useState } from "react";
import Header from "../../components/Header";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";

import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';
import market from '/assets/market.png'
import stock from '/assets/stock.png'
import report from '/assets/report.png'

let rol = "CLIENTE";

function ClientMain() {
    const [activeScreenCliente, setActiveScreenCliente] = useState("pedidosSucursal");

    // const renderScreen = () => {
    //     switch (activeScreenSucursal) {
    //         case "pedidosSucursal":
    //             return <PedidosSucursal/>;
    //         default:
    //             return <h2>Screen not found</h2>;
    //     }
    // };

    return (
      <>
        <div className="w-screen h-screen flex flex-col items-center">
        <Header rol={rol} />
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
              <NavbarIcon
                icon={carrito}
                text={"Pedidos"}
                // onClick={() => setActiveScreenSucursal("pedidosSucursal")}
                // selected={activeScreenSucursal === "pedidosSucursal"}
              />
            </div>
            <div className="w-full h-[20%]">
              <Profile />
            </div>
          </div>
          {/* {renderScreen()} */}
        </div>
      </div>
    </>
    );
}

export default ClientMain;
