import { useState, useEffect } from "react";
import Header from "../../components/Header";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import { motion } from 'framer-motion';
import PedidosRecibidos from "./PedidosRecibidos";
import NotificacionesDist from "./NotificacionesDist";
import Pedido from "./Pedido";

import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';

let rol = "DISTRIBUIDOR";

function DistribuidorMain() {
  const [activeScreenDist, setActiveScreenDist] = useState("pedidosRecibidos");
  const [pedidoModal, setPedidoModal] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/pedidos/general")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error fetching pedidos:", err));
  }, []);

  const renderScreen = () => {
    switch (activeScreenDist) {
      case "pedidosRecibidos":
        return (
          <PedidosRecibidos
            pedidoModal={pedidoModal}
            setPedidoModal={setPedidoModal}
            pedidos={pedidos}
            setPedido={setPedido}
          />
        );
      case "notificacionesDist":
        return <NotificacionesDist />;
      default:
        return <h2>Screen not found</h2>;
    }
  };

  return (
    <>
      {pedidoModal && pedido && (
        <Pedido onClose={() => setPedidoModal(false)} pedido={pedido} />
      )}

      <div className="w-screen h-screen flex flex-col items-center">
        <Header rol={rol} />
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
              <NavbarIcon
                icon={carrito}
                text={"Pedidos"}
                onClick={() => setActiveScreenDist("pedidosRecibidos")}
                selected={activeScreenDist === "pedidosRecibidos"}
              />
              <NavbarIcon
                icon={notificacion}
                text={"Notificaciones"}
                onClick={() => setActiveScreenDist("notificacionesDist")}
                selected={activeScreenDist === "notificacionesDist"}
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

export default DistribuidorMain;

// import { useState } from "react"
// import Header from "../../components/Header";
// import NavbarIcon from "../../components/NavbarIcon";
// import Profile from "../../components/Profile";
// import { motion } from 'framer-motion'
// import PedidosRecibidos from "./PedidosRecibidos";
// import NotificacionesDist from "./NotificacionesDist";
// import Pedido from "./Pedido";
// import pedidos from '../../../../routes/pedidos'


// let rol = "DISTRIBUIDOR"

// import carrito from '/assets/carrito.png'
// import notificacion from '/assets/notificacion.png'

// function DistribuidorMain() {
//     const [activeScreenDist, setActiveScreenDist] = useState("pedidosRecibidos");
//     const [pedidoModal, setPedidoModal] = useState(false);
//     const [pedido, setPedido] = useState([]);

//     const renderScreen = () => {
//         switch (activeScreenDist) {
//             case "pedidosRecibidos": 
//                 return <PedidosRecibidos pedidoModal={pedidoModal} setPedidoModal={setPedidoModal} pedidos={pedidos} setPedido={setPedido}/>;
//             case "notificacionesDist": 
//                 return <NotificacionesDist/>;
//             default:
//                 return <h2>Screen not found</h2>;
//         }
//     }

//     return (
//         <>
//             {pedidoModal && (
//                 <Pedido onClose={() => setPedidoModal(false)} pedido={pedido}></Pedido>
//             )}

//             <div className="w-screen h-screen flex flex-col items-center">
//                 <Header rol={rol}></Header>
//                 <hr className="w-[95%]"/>
//                 <div className="w-full h-[90%] flex">
//                     <div className="w-[25%] h-full">
//                         <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
//                             <NavbarIcon icon={carrito} 
//                                         text={"Pedidos"} 
//                                         onClick={() => setActiveScreenDist("pedidosRecibidos")} 
//                                         selected={activeScreenDist === "pedidosRecibidos"}>
//                             </NavbarIcon>
//                             <NavbarIcon icon={notificacion} 
//                                         text={"Notificaciones"} 
//                                         onClick={() => setActiveScreenDist("notificacionesDist")} 
//                                         selected={activeScreenDist === "notificacionesDist"}>
//                             </NavbarIcon>
//                         </div>
//                         <div className="w-full h-[20%]">
//                             <Profile />
//                         </div>
//                     </div>
//                     {renderScreen()}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default DistribuidorMain
