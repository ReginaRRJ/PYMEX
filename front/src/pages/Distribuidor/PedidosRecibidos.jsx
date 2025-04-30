



import { motion } from 'framer-motion';

function PedidosRecibidos({ pedidoModal, setPedidoModal, pedidos, setPedido }) {
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
          <tbody className="block w-full overflow-y-auto max-h-[55vh]">
            {pedidos.map((pedido, index) => (
              <tr
                key={index}
                className="flex w-full rounded-md hover:bg-slate-300 hover:cursor-pointer duration-300"
                onClick={() => {
                  setPedidoModal(true);
                  setPedido(pedido);
                }}
              >
                <td className="w-1/3 px-4 py-2">{pedido.Cliente}</td>
                <td className="w-1/3 px-4 py-2">{pedido.Ubicación}</td>
                <td className="w-1/3 px-4 py-2">{pedido.Estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default PedidosRecibidos;







// import { motion } from 'framer-motion'
// import { useState } from "react"

// function PedidosRecibidos({ pedidoModal, setPedidoModal, pedidos, setPedido }) {

//     return (
//         <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
//             <div className='h-[20%] w-full'>
//                 <h1 className="text-[40px]">Pedidos</h1> 
//                 <div className="h-[50px] w-full flex justify-between items-center">
//                     <h1>Manejo de los perfiles de usuario</h1>  
//                 </div>
//             </div>

//             <div className="w-full h-[75%]">
//                 <table className="table-fixed w-full h-full border-spacing-0">
//                     <thead className="block bg-slate-100 w-full">
//                         <tr className="w-full flex">
//                             <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Cliente</th>
//                             <th className="w-1/3 px-4 py-2 text-left">Ubicación</th>
//                             <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Estatus</th>
//                         </tr>
//                     </thead>
//                     <tbody className="block w-full overflow-y-auto max-h-[55vh]">
//                     {pedidos.map((pedido, index) => (
//                         <tr key={index} className="flex w-full rounded-md hover:bg-slate-300 hover:cursor-pointer duration-300" 
//                         onClick={() => {setPedidoModal(!pedidoModal); setPedido(pedido); }}>
//                             <td className="w-1/3 px-4 py-2">{pedido.cliente}</td>
//                             <td className="w-1/3 px-4 py-2">{pedido.ubicacion}</td>
//                             <td className="w-1/3 px-4 py-2">{pedido.estatus}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </motion.div>
//     )
// }

// export default PedidosRecibidos
