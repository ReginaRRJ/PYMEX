import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import pedidosData from './pedidos'

function PedidosCliente() {
  const [pedidos, setPedidos] = useState(pedidosData);
  const [error, setError] = useState("");

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
            <tbody className="block w-full overflow-y-auto max-h-[55vh]">
              {pedidos.length > 0 ? (
                [...pedidos]
                  .sort((a, b) => (a.estado === 'No autorizado' ? -1 : 1))
                  .map((pedido, index) => (
                    <tr
                      key={index}
                      className="w-full h-[4rem] flex rounded-md cursor-pointer hover:bg-slate-200 duration-200"
                    >
                    <td className="w-1/5 px-4 py-2">{pedido.sucursal}</td>
                    <td className="w-1/5 px-4 py-2">{pedido.producto} MXN</td>
                    <td className="w-1/5 px-4 py-2">{pedido.cantidad} unidades</td>
                    <td className="w-1/5 px-4 py-2">${pedido.precio} MXN</td>
                    <td className="w-1/5 px-4 py-1 flex justify-start items-center">
                      <button
                        className={`w-[70%] h-[2.5rem] rounded-2xl ${
                          pedido.estado === 'Autorizado'
                            ? 'bg-blue-200 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-300 duration-200'
                        }`}
                      >
                        {pedido.estado === 'No autorizado' ? 'Autorizar' : 'Autorizado'}
                      </button>
                    </td>
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
        )}
      </div>
    </motion.div>
  );
}

export default PedidosCliente;