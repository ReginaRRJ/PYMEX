// PedidosCliente.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function PedidosCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");

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

  // Function to handle the actual API call for updating status
  const updatePedidoStatusInBackend = useCallback(async (idPedido, statusForBackend) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/pedidosClient/${idPedido}/estatusCliente`,
        { estatusCliente: statusForBackend } // This is 'Autorizado' or 'No autorizado'
      );

      if (response.status === 200) {
        // --- ONLY CHANGE RELATED TO BUTTON VISIBILITY STARTS HERE ---
        // This updates the 'estado' property in your local state
        // which then makes the button visually change.
        const newFrontendStatus = statusForBackend === 'No autorizado' ? 'Por autorizar' : 'Autorizado';
        setPedidos(prevPedidos =>
          prevPedidos.map(pedido =>
            pedido.idPedido === idPedido ? { ...pedido, estado: newFrontendStatus } : pedido
          )
        );
        // --- ONLY CHANGE RELATED TO BUTTON VISIBILITY ENDS HERE ---
        setError(""); // Clear any previous errors on successful update
        return true; // Indicate success
      } else {
        setError(`Error inesperado al actualizar el pedido: ${response.data.message || response.data || 'Mensaje desconocido'}`);
        return false; // Indicate failure
      }
    } catch (err) {
      console.error("Error al actualizar el estatus del pedido:", err);
      if (err.response && err.response.data) {
        setError(`Error al actualizar el pedido: ${err.response.data.message || err.response.data}`); // Added .message for better error display
      } else {
        setError("Error de red o servidor al actualizar el estatus del pedido. Inténtalo de nuevo.");
      }
      return false; // Indicate failure
    }
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!idPyme) {
        setError("ID de PYME no disponible. Por favor, inicia sesión para ver los pedidos.");
        setPedidos([]);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/api/pedidosClient/${idPyme}`);

        if (Array.isArray(response.data)) {
          const processedPedidos = response.data.map(pedido => {
            // Reverted to original casing for data fields to ensure correct display
            // This is crucial for fixing the "0" display issue.
            let rawEstatusClienteFromDB = pedido.ESTATUSCLIENTE;
            const rawEstatusProveedorFromDB = pedido.ESTATUSGENERALPEDIDO;

            const isProveedorLocked = (rawEstatusProveedorFromDB !== 'Pendiente' && rawEstatusProveedorFromDB !== 'Por autorizar');

            let finalEstatusClienteForFrontend;
            // Removed automatic backend update here, as it was problematic and
            // not directly related to the button's visual state change.
            // The button's state is handled by updatePedidoStatusInBackend and local state.

            if (isProveedorLocked) {
                finalEstatusClienteForFrontend = 'Autorizado';
                // If the supplier has locked it and the client's status isn't 'Autorizado'
                // you might still *want* to call the backend to set it.
                // However, doing it *during a fetch* can cause infinite loops.
                // It's better to let the "Autorizar" button handle this user action.
                // For now, we'll just display it as 'Autorizado' on the frontend.
            } else {
                if (rawEstatusClienteFromDB === 'Autorizado') {
                    finalEstatusClienteForFrontend = 'Autorizado';
                } else {
                    finalEstatusClienteForFrontend = 'Por autorizar';
                }
            }

            return {
                ...pedido,
                sucursal: pedido.nombreSucursal,
                producto: pedido.nombreProductoo,
                cantidad: pedido.CANTIDADPEDIDO, // Reverted to original casing
                precio: pedido.TOTALPEDIDOPRODUCTO, // Reverted to original casing
                estado: finalEstatusClienteForFrontend, // This drives the button text and disabled state
                estatusProveedor: rawEstatusProveedorFromDB,
                idPedido: pedido.idPedido
            };
          });
          setPedidos(processedPedidos); // No filter(Boolean) needed if all are valid
        } else {
          console.warn("API response for pedidos is not an array:", response.data);
          setPedidos([]);
          setError("El formato de datos de pedidos recibido es incorrecto.");
        }
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        setError("Error al cargar los pedidos. Inténtalo de nuevo más tarde.");
      }
    };
    fetchPedidos();
  }, [idPyme, updatePedidoStatusInBackend]); // Dependency on updatePedidoStatusInBackend is fine due to useCallback

  const handleAuthorizeOrder = async (idPedido) => {
    const pedidoToUpdate = pedidos.find(p => p.idPedido === idPedido);

    if (!pedidoToUpdate) {
      console.error("Pedido no encontrado para actualizar:", idPedido);
      return;
    }

    const currentProveedorStatus = pedidoToUpdate.estatusProveedor;
    const isProveedorLocked = (currentProveedorStatus !== 'Pendiente' && currentProveedorStatus !== 'Por autorizar');
    const currentClientStatusFrontend = pedidoToUpdate.estado;

    // IMPORTANT: Check if button should be disabled *here* to prevent click
    // If already 'Autorizado', or if 'ProveedorLocked' (meaning it's displayed as Autorizado and unclickable)
    if (currentClientStatusFrontend === 'Autorizado' || isProveedorLocked) {
        setError("El estado de este pedido no puede ser modificado.");
        return;
    }

    // If the button is clickable, it means currentClientStatusFrontend is 'Por autorizar'.
    // So, the next status we want to send to the backend is 'Autorizado'.
    const nextStatusForBackend = 'Autorizado';

    // This call will update the backend, and if successful, the `updatePedidoStatusInBackend`
    // function's internal `setPedidos` will update the local state, changing the button.
    await updatePedidoStatusInBackend(idPedido, nextStatusForBackend);
  };

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
                <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Sucursal</th>
                <th className="w-1/5 px-4 py-2 text-left">Producto</th>
                <th className="w-1/5 px-4 py-2 text-left">Cantidad</th>
                <th className="w-1/5 px-4 py-2 text-left">Precio</th>
                <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Estado</th>
              </tr>
            </thead>
            <tbody 
            id="pedido-list"
            className="block w-full overflow-y-auto max-h-[55vh]">
              {pedidos.length > 0 ? (
                [...pedidos]
                  .sort((a, b) => (a.estado === 'Por autorizar' ? -1 : 1))
                  .map((pedido, index) => {
                    const currentClientStatus = pedido.estado;
                    const currentProveedorStatus = pedido.estatusProveedor;

                    const isProveedorLocked = (currentProveedorStatus !== 'Pendiente' && currentProveedorStatus !== 'Por autorizar');

                    // Button is disabled if:
                    // 1. Client status is already 'Autorizado' (your new requirement)
                    // 2. Or, if supplier status locks it (meaning it's also displayed as 'Autorizado')
                    const buttonDisabled = currentClientStatus === 'Autorizado' || isProveedorLocked;

                    return (
                      <tr
                        key={index}
                        className="w-full h-[4rem] flex rounded-md cursor-pointer hover:bg-slate-200 duration-200"
                      >
                        <td className="w-1/5 px-4 py-2">{pedido.sucursal}</td>
                        <td className="w-1/5 px-4 py-2">{pedido.producto}</td>
                        <td className="w-1/5 px-4 py-2">{(pedido.cantidad || 'N/A')} unidades</td>
                        <td className="w-1/5 px-4 py-2">${(pedido.precio || '0.00')} MXN</td>
                        <td className="w-1/5 px-4 py-1 flex justify-start items-center">
                          <button
                            onClick={() => handleAuthorizeOrder(pedido.idPedido)}
                            disabled={buttonDisabled}
                            className={`w-[70%] h-[2.5rem] rounded-2xl ${
                              buttonDisabled // If button is disabled, apply the 'bg-blue-200' style
                                ? 'bg-blue-200 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-300 duration-200'
                            }`}
                          >
                            {/* Button text is 'Autorizado' if disabled, otherwise 'Autorizar' */}
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
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import pedidosData from './pedidos'

// function PedidosCliente() {
//   const [pedidos, setPedidos] = useState(pedidosData);
//   const [error, setError] = useState("");

//   return (
//     <motion.div
//       className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="h-[20%] w-full">
//         <h1 className="text-[40px]">Pedidos</h1>
//         <div className="h-[50px] w-full flex justify-between items-center">
//           <h1>Pedidos que se han realizado a distribuidor</h1>  
//         </div>
//       </div>

//       <div className="w-full h-[75%]">
//         {error ? (
//           <div className="text-red-500 text-center py-4">{error}</div>
//         ) : (
//           <table className="table-fixed w-full h-full border-spacing-0">
//           <thead className="block bg-slate-100 w-full">
//               <tr className="w-full flex">
//                   <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Sucursal</th>
//                   <th className="w-1/5 px-4 py-2 text-left">Producto</th>
//                   <th className="w-1/5 px-4 py-2 text-left">Cantidad</th>
//                   <th className="w-1/5 px-4 py-2 text-left">Precio</th>
//                   <th className="w-1/5 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Estado</th>
//               </tr>
//             </thead>
//             <tbody className="block w-full overflow-y-auto max-h-[55vh]">
//               {pedidos.length > 0 ? (
//                 [...pedidos]
//                   .sort((a, b) => (a.estado === 'No autorizado' ? -1 : 1))
//                   .map((pedido, index) => (
//                     <tr
//                       key={index}
//                       className="w-full h-[4rem] flex rounded-md cursor-pointer hover:bg-slate-200 duration-200"
//                     >
//                     <td className="w-1/5 px-4 py-2">{pedido.sucursal}</td>
//                     <td className="w-1/5 px-4 py-2">{pedido.producto} MXN</td>
//                     <td className="w-1/5 px-4 py-2">{pedido.cantidad} unidades</td>
//                     <td className="w-1/5 px-4 py-2">${pedido.precio} MXN</td>
//                     <td className="w-1/5 px-4 py-1 flex justify-start items-center">
//                       <button
//                         className={`w-[70%] h-[2.5rem] rounded-2xl ${
//                           pedido.estado === 'Autorizado'
//                             ? 'bg-blue-200 cursor-not-allowed'
//                             : 'bg-blue-500 text-white hover:bg-blue-300 duration-200'
//                         }`}
//                       >
//                         {pedido.estado === 'No autorizado' ? 'Autorizar' : 'Autorizado'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//               <tr className="w-full flex">
//                 <td colSpan="3" className="text-center w-full py-4 text-gray-500">
//                   No se encontraron pedidos.
//                 </td>
//               </tr>
//             )}

//             </tbody>
//           </table>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// export default PedidosCliente;