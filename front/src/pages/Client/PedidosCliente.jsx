import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const token = localStorage.getItem('token');

function PedidosCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const storedUserString = localStorage.getItem('usuario');
  let idPyme = null;

  if (storedUserString) {
    try {
      const parsedUser = JSON.parse(storedUserString);
      idPyme = parsedUser.idPyme;
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      setError("Error al leer los datos de usuario. Por favor, intenta iniciar sesión de nuevo.");
    }
  }

  const API_BASE_URL = 'http://localhost:3001';

  const updatePedidoStatusInBackend = useCallback(async (idPedido, statusForBackend) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/pedidosClient/${idPedido}/estatusCliente`,
        { estatusCliente: statusForBackend },
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const newFrontendStatus = statusForBackend === 'No autorizado' ? 'Por autorizar' : 'Autorizado';
        setPedidos(prevPedidos =>
          prevPedidos.map(pedido =>
            pedido.idPedido === idPedido ? { ...pedido, estado: newFrontendStatus } : pedido
          )
        );
        setError("");
        return true;
      } else {
        setError(`Error inesperado al actualizar el pedido: ${response.data.message || response.data || 'Mensaje desconocido'}`);
        return false;
      }
    } catch (err) {
      console.error("Error al actualizar el estatus del pedido:", err);
      if (err.response && err.response.data) {
        setError(`Error al actualizar el pedido: ${err.response.data.message || err.response.data}`);
      } else {
        setError("Error de red o servidor al actualizar el estatus del pedido. Inténtalo de nuevo.");
      }
      return false;
    }
  }, []);

  const fetchPedidos = useCallback(async () => {
    if (!idPyme) {
      setError("ID de PYME no disponible. Por favor, inicia sesión para ver los pedidos.");
      setPedidos([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/pedidosClient/${idPyme}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        const processedPedidos = response.data.map(pedido => {
          const rawEstatusClienteFromDB = pedido.ESTATUSCLIENTE;
          const rawEstatusProveedorFromDB = pedido.ESTATUSGENERALPEDIDO;

          const isProveedorLocked = (rawEstatusProveedorFromDB !== 'Pendiente' && rawEstatusProveedorFromDB !== 'Por autorizar');

          let finalEstatusClienteForFrontend;
          if (isProveedorLocked) {
            finalEstatusClienteForFrontend = 'Autorizado';
          } else {
            finalEstatusClienteForFrontend = (rawEstatusClienteFromDB === 'Autorizado') ? 'Autorizado' : 'Por autorizar';
          }

          return {
            ...pedido,
            sucursal: pedido.nombreSucursal,
            producto: pedido.nombreProductoo,
            cantidad: pedido.CANTIDADPEDIDO,
            precio: pedido.TOTALPEDIDOPRODUCTO,
            estado: finalEstatusClienteForFrontend,
            estatusProveedor: rawEstatusProveedorFromDB,
            idPedido: pedido.idPedido
          };
        });
        setPedidos(processedPedidos);
      } else {
        console.warn("API response for pedidos is not an array:", response.data);
        setPedidos([]);
        setError("El formato de datos de pedidos recibido es incorrecto.");
      }
    } catch (err) {
      console.error("Error fetching pedidos:", err);
      setError("Error al cargar los pedidos. Inténtalo de nuevo más tarde.");
    }
  }, []);

  const handleAuthorizeOrder = async (idPedido) => {
    const pedidoToUpdate = pedidos.find(p => p.idPedido === idPedido);
    if (!pedidoToUpdate) return;

    const currentProveedorStatus = pedidoToUpdate.estatusProveedor;
    const isProveedorLocked = (currentProveedorStatus !== 'Pendiente' && currentProveedorStatus !== 'Por autorizar');
    const currentClientStatusFrontend = pedidoToUpdate.estado;

    if (currentClientStatusFrontend === 'Autorizado' || isProveedorLocked) {
      setError("El estado de este pedido no puede ser modificado.");
      return;
    }

    const success = await updatePedidoStatusInBackend(idPedido, 'Autorizado');
    if (success) await fetchPedidos();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user && user.idUsuario) cargarUsuarioYAlertas();
  }, [user]);

  const cargarUsuarioYAlertas = async () => {
    if (user.idUsuario) {
      try {
        const id = parseInt(user.idUsuario, 10);
        const currentToken = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/notificaciones/alertas/${id}`, {
          headers: { "Authorization": `Bearer ${currentToken}` }
        });
        const data = await response.json();
        notif(data.resultado || []);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    }
  };

  const notif = async (notificaciones) => {
    for (const notificacion of notificaciones) {
      if (!notificacion.leida) toast.warn(`${notificacion.mensaje}`);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  return (
    <motion.div
      className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Pedidos</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Pedidos que se han realizado a distribuidor</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <table className="table-fixed w-full h-full border-spacing-0">
            <thead className="block bg-slate-100 w-full">
              <tr className="w-full flex">
                <th className="w-1/5 px-4 py-2 text-left">Sucursal</th>
                <th className="w-1/5 px-4 py-2 text-left">Producto</th>
                <th className="w-1/5 px-4 py-2 text-left">Cantidad</th>
                <th className="w-1/5 px-4 py-2 text-left">Precio</th>
                <th className="w-1/5 px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody
              id="pedido-list"
              className="block w-full overflow-y-auto max-h-[55vh]"
            >
              {pedidos.length > 0 ? (
                [...pedidos]
                  .sort((a, b) => (a.estado === 'Por autorizar' ? -1 : 1))
                  .map((pedido, index) => {
                    const buttonDisabled = pedido.estado === 'Autorizado' || (pedido.estatusProveedor !== 'Pendiente' && pedido.estatusProveedor !== 'Por autorizar');

                    return (
                      <tr
                        key={index}
                        className="w-full h-[4rem] flex rounded-md cursor-pointer hover:bg-slate-200 duration-200"
                      >
                        <td className="w-1/5 px-4 py-2">{pedido.sucursal}</td>
                        <td className="w-1/5 px-4 py-2">{pedido.producto}</td>
                        <td className="w-1/5 px-4 py-2">{pedido.cantidad || 'N/A'} unidades</td>
                        <td className="w-1/5 px-4 py-2">${pedido.precio || '0.00'} MXN</td>
                        <td className="w-1/5 px-4 py-1 flex justify-start items-center">
                          <button
                            onClick={() => handleAuthorizeOrder(pedido.idPedido)}
                            disabled={buttonDisabled}
                            className={`w-[70%] h-[2.5rem] rounded-2xl ${
                              buttonDisabled
                                ? 'bg-blue-200 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-300 duration-200'
                            }`}
                          >
                            {buttonDisabled ? 'Autorizado' : 'Autorizar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr className="w-full flex">
                  <td colSpan="5" className="text-center w-full py-4 text-gray-500">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

export default PedidosCliente;
