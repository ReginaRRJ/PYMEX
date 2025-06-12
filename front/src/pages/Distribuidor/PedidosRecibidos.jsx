import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';



function PedidosRecibidos({ pedidoModal, setPedidoModal, pedidos, setPedido, setPedidos, user }) {
  const safePedidos = Array.isArray(pedidos) ? pedidos : [];
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (user && user.idUsuario) {
      cargarUsuarioYAlertas();
    }
  }, [user]);

  const cargarUsuarioYAlertas = async () => {
    if (user.idUsuario) {
      try {
        const id = parseInt(user.idUsuario, 10);
        const response = await fetch(
          `https://pymex-production.up.railway.app/notificaciones/alertas/${id}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
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

  const handleStatusChange = (pedidoId, newEstado) => {
    const updated = safePedidos.map(p =>
      p.id === pedidoId ? { ...p, Estado: newEstado } : p
    );
    setPedidos(updated);
  };

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
          <h1>Listado general de pedidos del proveedor</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        <table className="table-fixed w-full h-full border-spacing-0">
          <thead className="block bg-slate-100 w-full">
            <tr className="w-full flex">
              <th className="w-1/3 px-4 py-2 text-left">Cliente</th>
              <th className="w-1/3 px-4 py-2 text-left">Ubicación</th>
              <th className="w-1/3 px-4 py-2 text-left">Estatus</th>
            </tr>
          </thead>
          <tbody
            id="pedido-list"
            className="block w-full overflow-y-auto max-h-[55vh]"
          >
            {safePedidos.length > 0 ? (
              safePedidos.map((pedido, index) => (
                <tr
                  key={index}
                  className="flex w-full rounded-md hover:bg-slate-300 hover:cursor-pointer duration-300"
                  onClick={() => {
                    setPedidoModal(true);
                    setPedido({
                      ...pedido,
                      onStatusChange: (newStatus) =>
                        handleStatusChange(pedido.id, newStatus),
                    });
                  }}
                >
                  <td className="w-1/3 px-4 py-2">{pedido.Cliente}</td>
                  <td className="w-1/3 px-4 py-2">{pedido.Ubicación}</td>
                  <td className="w-1/3 px-4 py-2">{pedido.Estado}</td>
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
  );
}

export default PedidosRecibidos;
