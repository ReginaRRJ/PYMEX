import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify';
import axios from 'axios';

const token = localStorage.getItem('token');
function ActualizarPedido({onClose, idPedido}) {
    console.log("Recibiendo idPedido en modal:", idPedido);
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleActualizar = async () => {
  try {
    const response = await axios.put(`http://localhost:3001/api/sucursal/pedido/${idPedido}/estado`, {
      estatusProveedor: "Entregado"
    });

    console.log("Pedido actualizado:", response.data);
    toast.success("Pedido actualizado exitosamente");

    try {
      const spResponse = await fetch(`http://localhost:3001/notificaciones/actualizar/${idPedido}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idPedido: idPedido,
          idTipoNotificacion: 9,
          mensaje: "¡Tu pedido ha sido actualizado a Entregado!"
        })
      });

     
      console.log("LLAMADO CORRECTAMENTE AL STORED PROCEDURE");
    } catch (error) {
      console.log("ERROR EN STORE PROCEDURE ACTUALIZAR", error);
    }

    onClose(); // Mover esto hasta después de todo
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    toast.error("Error al actualizar el pedido");
  }
};


    // Handle change event to update the selected role
    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
            initial={{ opacity: 0}}
            animate={{opacity: 1}}
            transition={{ duration: 0.2 }}>
                <motion.div className="bg-white rounded-xl w-[50%] h-[30%] relative text-center" onClick={handleContentClick}
                initial={{ opacity: 0, scale: 0.3}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, size: 0}}
                transition={{ duration: 0.2 }}>
                    <div className='w-full h-full flex flex-col justify-around'>
                        <h1 className='cursor-pointer text-[20px] absolute top-2 right-3' onClick={onClose}>x</h1>
                        <h1 className='text-[2rem]  font-bold'>Actualiza el pedido</h1>
                        <h1 className=''>¿Estas segur@ que quieres actualizar el estado del pedido a “Entregado” ?”</h1>
                        <div className='h-[15%] w-full flex justify-center items-center gap-4'>
                            <button className='h-[40px] w-[150px] rounded-2xl text-white bg-blue-500 hover:bg-blue-700' onClick={onClose}
                            >Cancelar</button>
                            <button className='h-[40px] w-[150px] rounded-2xl text-white bg-black hover:bg'
                            onClick={handleActualizar}
                            >Actualizar</button>
                        </div>
                    </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ActualizarPedido
// import { motion, AnimatePresence } from 'framer-motion'
// import { toast } from 'react-toastify';
// import axios from 'axios';

// function ActualizarPedido({onClose, idPedido}) {
//     console.log("Recibiendo idPedido en modal:", idPedido);
//     const handleContentClick = (e) => {
//         e.stopPropagation();
//     };

//     const handleActualizar = async () => {
//         try {
//         const response = await axios.put(`http://localhost:3001/api/sucursal/pedido/${idPedido}/estado`, {
//             estatusProveedor: "Entregado"
//         });

//         console.log("Pedido actualizado:", response.data);
//         onClose(); // Cierra el modal después de actualizar
//         toast.success("Pedido actualizado exitosamente");
//         } catch (error) {
//         console.error("Error al actualizar pedido:", error);
//         toast.error("Error al actualizar el pedido");
//         }
//     };

//     // Handle change event to update the selected role
//     const handleChange = (e) => {
//         setSelectedRole(e.target.value);
//     };

//     return (
//         <AnimatePresence>
//             <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
//             initial={{ opacity: 0}}
//             animate={{opacity: 1}}
//             transition={{ duration: 0.2 }}>
//                 <motion.div className="bg-white rounded-xl w-[50%] h-[30%] relative text-center" onClick={handleContentClick}
//                 initial={{ opacity: 0, scale: 0.3}}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, size: 0}}
//                 transition={{ duration: 0.2 }}>
//                     <div className='w-full h-full flex flex-col justify-around'>
//                         <h1 className='cursor-pointer text-[20px] absolute top-2 right-3' onClick={onClose}>x</h1>
//                         <h1 className='text-[2rem]  font-bold'>Actualiza el pedido</h1>
//                         <h1 className=''>¿Estas segur@ que quieres actualizar el estado del pedido a “Entregado” ?”</h1>
//                         <div className='h-[15%] w-full flex justify-center items-center gap-4'>
//                             <button className='h-[40px] w-[150px] rounded-2xl text-white bg-blue-500 hover:bg-blue-700' onClick={onClose}
//                             >Cancelar</button>
//                             <button className='h-[40px] w-[150px] rounded-2xl text-white bg-black hover:bg'
//                             onClick={handleActualizar}
//                             >Actualizar</button>
//                         </div>
//                     </div>
                
//                 </motion.div>
//             </motion.div>
//         </AnimatePresence>
//     )
// }

// export default ActualizarPedido