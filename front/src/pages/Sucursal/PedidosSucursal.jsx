import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";



function PedidosSucursal({updateButton, setUpdateButton,newOrder, setNewOrder, setPedidoSeleccionadoId}) {
  const [pedidosSuc, setPedidosSuc] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const fetchPedidos = async () => {
      try {
  
        const response = await fetch(`https://pymex-production.up.railway.app/api/sucursal/usuario/${user.idUsuario}`,{
  headers: {
    "Authorization": `Bearer ${token}`
  }
}); 
        if (!response.ok) {
          throw new Error('Error obteniendo pedidos');
        }
        const data = await response.json();
        console.log("Pedidos recibidos:", data);
        setPedidosSuc(data);
      } catch (error) {
        console.error("Error obteniendo pedidos:", error);
      }
    };
  
    fetchPedidos();
  }, [user]);

  useEffect(() => {
  if (user && user.idUsuario) {
    cargarUsuarioYAlertas();
  }
}, [user]);

  const cargarUsuarioYAlertas = async () => {
    if (user.idUsuario) {

      console.log("Cargando notificaciones...", user.idUsuario);

      try {
        const id = parseInt(user.idUsuario, 10);
        console.log("Obteniendo notificaciones no leídas para el usuario:", id);
        const response = await fetch(
          `https://pymex-production.up.railway.app/notificaciones/alertas/${id}`, {
            headers:{
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        console.log("Notificaciones:", data);
        notif(data.resultado || []);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    }
  };

  const notif = async (notificaciones) => {
    for (let i = 0; i < notificaciones.length; i++) {
      const notificacion = notificaciones[i];
      if (notificacion.leida === false) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        toast.warn(`${notificacion.mensaje}`);
      }
    }
  };


  if (!user) {
    return <div>Cargando...</div>;
  }
    return (
        <motion.div
      className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Pedidos</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Pedidos que se han hecho a distribuidor</h1>  
          <button
            className="w-[18%] h-full bg-slate-900 rounded-2xl text-white"
            onClick={() => setNewOrder(!newOrder)}
          >
            + Agregar pedido
          </button>
        </div>
      </div>

      <div className="w-full h-[75%]">
          <table className="table-fixed w-full h-full border-spacing-0">
          <thead className="block bg-slate-100 w-full">
              <tr className="w-full flex">
                  <th className="w-[40%] px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Nombre</th>
                  <th className="w-[20%] px-4 py-2 text-left">Total</th>
                  <th className="w-[20%] px-4 py-2 text-left">Cantidad</th>
                  <th className="w-[20%] px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody 
            id="pedido-list"
            className="block w-full overflow-y-auto max-h-[55vh]">
              {pedidosSuc.length > 0 ? (
                pedidosSuc.map((pedido, index) => (
                  <tr
                    key={index}
                    className="flex w-full rounded-md hover:bg-slate-300 cursor-pointer duration-300"
                    onClick={() => { console.log("Pedido ID clickeado:", pedido.idPedido);
                      setPedidoSeleccionadoId(pedido.idPedido);
                      setUpdateButton(true);
                    }}

                  >
                    <td className="w-[40%] px-4 py-2">{pedido.nombre}</td>
                    <td className="w-[20%] px-4 py-2">${pedido.total} MXN</td>
                    <td className="w-[20%] px-4 py-2">{pedido.cantidad}</td>
                    <td className="w-[20%] px-4 py-2">{pedido.estatusProveedor}</td>
                  </tr>
                ))
              ) : (
                <tr className="w-full flex">
                  <td colSpan="3" className="text-center w-full py-4 text-gray-500">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </motion.div>
    )
}

export default PedidosSucursal
