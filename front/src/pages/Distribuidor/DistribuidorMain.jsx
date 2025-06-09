import { useState, useEffect } from "react";
import Header from "../../components/Header";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import PedidosRecibidos from "./PedidosRecibidos";
import NotificacionesDist from "./NotificacionesDist";
import Pedido from "./Pedido";
import Notificaciones from "../../components/Notifications";
import notificacionesData from "./notificaciones";
import carrito from '/assets/carrito.png';
import notificacion from '/assets/notificacion.png';

let rol = "DISTRIBUIDOR";


function getIdFromToken(token) {

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const parsedToken = JSON.parse(jsonPayload);
    return parsedToken.idUsuario;
  } catch (err) {
    console.error("Error decodificando token", err);
    return null;
  }
}

function DistribuidorMain() {
  const [activeScreenDist, setActiveScreenDist] = useState("pedidosRecibidos");
  const [pedidoModal, setPedidoModal] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [notificationsModal, setNotificationsModal] = useState(false);
  const [notificaciones, setNotificaciones] = useState(notificacionesData);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);
  const token = localStorage.getItem('token');

  const idUsuario = getIdFromToken(token);

  const abrirActualizarPedido = (idPedido) => {
    setPedidoSeleccionadoId(idPedido);
    console.log("ID del pedido seleccionado:", idPedido);
  };

  useEffect(() => {
    if (!idUsuario) {
      console.error("No se pudo obtener idUsuario desde el token.");
      return;
    }

    fetch(`http://localhost:3001/api/pedidos/general`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => res.json())
    .then((data) => setPedidos(data))
    .catch((err) => console.error("Error fetching pedidos:", err));
  }, [idUsuario]);

  const renderScreen = () => {
    switch (activeScreenDist) {
      case "pedidosRecibidos":
        return (
          <PedidosRecibidos
            pedidoModal={pedidoModal}
            setPedidoModal={setPedidoModal}
            pedidos={pedidos}
            setPedido={setPedido}
            setPedidoSeleccionadoId={setPedidoSeleccionadoId}
            onActualizarPedido={abrirActualizarPedido}
          />
        );
      case "notificacionesDist":
        return <NotificacionesDist />;
      default:
        return <h2>Pantalla no encontrada</h2>;
    }
  };

  return (
    <>
      {pedidoModal && pedido && (
        <Pedido
          onClose={() => {
            setPedidoModal(false);
            setPedidoSeleccionadoId(null);
          }}
          pedido={pedido}
        />
      )}

      {notificationsModal && (
        <Notificaciones
          onClose={() => setNotificationsModal(false)}
          notificaciones={notificaciones}
        />
      )}

      <div className="w-screen h-screen flex flex-col items-center">
        <Header
          rol={rol}
          bell={true}
          notificaciones={notificaciones}
          setNotificationsModal={setNotificationsModal}
        />
        <hr className="w-[95%]" />
        <div className="w-full h-[90%] flex">
          <div className="w-[25%] h-full">
            <div id="Navbar" className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
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
