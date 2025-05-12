import React from "react";
import { motion } from "framer-motion";
import pedidosSuc from './pedidosSuc'

function PedidosSucursal() {
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
            // onClick={() => setAddUserModal(!addUserModal)}
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
            <tbody className="block w-full overflow-y-auto max-h-[55vh]">
              {pedidosSuc.length > 0 ? (
                pedidosSuc.map((pedido, index) => (
                  <tr
                    key={index}
                    className="flex w-full rounded-md hover:bg-slate-300 cursor-pointer duration-300"
                    // onClick={() => {setEditUserModal(!editUserModal); setUsuarioSeleccionado(user)}}
                  >
                    <td className="w-[40%] px-4 py-2">{pedido.nombre}</td>
                    <td className="w-[20%] px-4 py-2">${pedido.total} MXN</td>
                    <td className="w-[20%] px-4 py-2">{pedido.cantidad}</td>
                    <td className="w-[20%] px-4 py-2">{pedido.estado}</td>
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