

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { StepperComp } from './StepperComp';

function Pedido({ pedido, onClose }) {
  const [pedidoData, setPedidoData] = useState(null);

  useEffect(() => {
    if (!pedido?.id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/pedidos/detalle/${pedido.id}`);
        const data = await res.json();

        // Ya no es un array, sino un solo objeto
        setPedidoData(data);
      } catch (err) {
        console.error('Error fetching detailed pedido:', err);
      }
    };

    fetchData();
  }, [pedido]);

  const handleContentClick = (e) => e.stopPropagation();

  if (!pedidoData) {
    return (
      <AnimatePresence>
        <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div className="bg-white rounded-xl w-[75%] h-[80%] p-10 flex items-center justify-center text-xl font-semibold">
            Cargando pedido...
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-xl w-[75%] h-[80%] p-10"
          onClick={handleContentClick}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-[10%] w-full flex items-center pr-5">
            <h1 className="text-[2.5rem] font-extrabold">Pedido</h1>
          </div>
          <div className="h-[5%] w-full flex items-center pr-5">
            <h1 className="font-medium">
              {pedidoData.Cliente} - {pedidoData.Ubicación}
            </h1>
          </div>
          <br />
          <div className="h-[80%] w-full flex justify-between">
            <div className="h-full w-[32%] rounded-xl bg-slate-200 p-10">
              <h1 className="font-bold">Detalles</h1>
              <br />
              <h1 className="font-bold">ID:</h1>
              <h1>{pedidoData.ID}</h1>
              <br />
              <h1 className="font-bold">Producto:</h1>
              <h1>{pedidoData.Producto}</h1>
            </div>
            <div className="h-full w-[32%] bg-slate-200 rounded-xl p-10">
              <h1 className="font-bold">Fechas de pedido</h1>
              <br />
              <h1 className="font-bold">Fecha de Solicitud:</h1>
              <h1>{pedidoData["Fecha de Solicitud"]}</h1>
              <br />
              <h1 className="font-bold">Fecha de Entrega:</h1>
              <h1>{pedidoData["Fecha de Entrega"]}</h1>
              <br />
              <div className="h-[30%] w-full">
                <StepperComp pedidoId={pedidoData.ID} /> {/* Pasamos el pedidoId a StepperComp */}
              </div>
            </div>
            <div className="h-full w-[32%] bg-slate-200 rounded-xl p-10">
              <h1 className="font-bold">Contacto</h1>
              <br />
              <h1 className="font-bold">Teléfono:</h1>
              <h1>{pedidoData["Teléfono"]}</h1>
              <br />
              <h1 className="font-bold">Correo:</h1>
              <h1 className="whitespace-nowrap overflow-y-auto">
                {pedidoData["Correo"]}
              </h1>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Pedido;











// import { motion, AnimatePresence } from 'framer-motion'
// import { useState } from 'react';
// import { StepperComp } from './StepperComp';

// function Pedido({pedido, onClose}) {
//     const handleContentClick = (e) => {
//         e.stopPropagation();
//     };

//     return (
//         <AnimatePresence>
//             <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
//             initial={{ opacity: 0}}
//             animate={{opacity: 1}}
//             transition={{ duration: 0.2 }}>
//                 <motion.div className="bg-white rounded-xl w-[75%] h-[80%] p-10" onClick={handleContentClick}
//                 initial={{ opacity: 0, scale: 0.3}}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, size: 0}}
//                 transition={{ duration: 0.2 }}>
//                     {/* <div className='h-[10%] w-full flex items-center justify-end p-5'>
//                         <h1 className='cursor-pointer text-[20px]' onClick={onClose}>x</h1>
//                     </div> */}
//                     <div className='h-[10%] w-full flex items-center pr-5'>
//                         <h1 className='text-[2.5rem] font-extrabold'>Pedido</h1>
//                     </div>
//                     <div className='h-[5%] w-full flex items-center pr-5'>
//                         <h1 className='font-medium'>{pedido.cliente} - {pedido.ubicacion}</h1>
//                     </div>
//                     <br />
//                     <div className='h-[80%] w-full flex justify-between'>
//                         <div className='h-full w-[32%] rounded-xl bg-slate-200 p-10'>
//                             <h1 className='font-bold'>Detalles</h1>
//                             <br />
//                             <br />
//                             <h1 className='font-bold'>ID:</h1>
//                             <h1>{pedido.id}</h1>
//                             <br />
//                             <h1 className='font-bold'>Producto:</h1>
//                             <h1>{pedido.producto}</h1>
//                         </div>
//                         <div className='h-full w-[32%] bg-slate-200 rounded-xl p-10'>
//                             <h1 className='font-bold'>Fechas de pedido</h1>
//                             <br />
//                             <br />
//                             <h1 className='font-bold'>Fecha de Solicitud:</h1>
//                             <h1>{pedido.fecha_de_solicitud}</h1>
//                             <br />
//                             <h1 className='font-bold'>Fecha de entrega</h1>
//                             <h1>{pedido.fecha_de_entrega}</h1>
//                             <br />
//                             <div className='h-[30%] w-full'>
//                                 <StepperComp />
//                             </div>
//                         </div>
//                         <div className='h-full w-[32%] bg-slate-200 rounded-xl p-10'>
//                             <h1 className='font-bold'>Contacto</h1>
//                             <br />
//                             <br />
//                             <h1 className='font-bold'>Teléfono:</h1>
//                             <h1>{pedido.telefono}</h1>
//                             <br />
//                             <h1 className='font-bold'>Correo:</h1>
//                             <h1 className='whitespace-nowrap overflow-y-auto'>{pedido.correo}</h1>
//                         </div>
//                     </div>
//                 </motion.div>
//             </motion.div>
//         </AnimatePresence>
//     )
// }

// export default Pedido
