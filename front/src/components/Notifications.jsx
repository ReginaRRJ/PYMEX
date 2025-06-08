import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Notification from '../components/Notification';

function Notificaciones({ onClose }) {
  const [user, setUser] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);

  const token = localStorage.getItem("token");

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.idUsuario) {
      cargarUsuarioYAlertas();
    }
  }, [user]);

  const cargarUsuarioYAlertas = async () => {
    try {
      const id = parseInt(user.idUsuario, 10);
      console.log("Obteniendo notificaciones para el usuario:", id);
      
      const currentToken = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3001/notificaciones/alertas/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${currentToken}`,
          },
        }
      );
      const data = await response.json();

      console.log("Notificaciones recibidas:", data.resultado);
      setNotificaciones(data.resultado || []);

      mostrarNotificaciones(data.resultado || []);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  const mostrarNotificaciones = (notificaciones) => {
    for (const noti of notificaciones) {
      if (!noti.leida) {
        toast.warn(noti.mensaje);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-xl w-[60%] h-[80%]"
          onClick={handleContentClick}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, size: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3">
            <h1 className="cursor-pointer text-[20px]" onClick={onClose}>
              x
            </h1>
          </div>
          <div className="h-[15%] w-full flex justify-center items-center text-[2rem]">
            Notificaciones
          </div>
          <div className="h-[75%] w-full px-10">
            <div className="h-full overflow-y-auto">
              {notificaciones.length > 0 ? (
                notificaciones.map((notification, index) => (
                  <Notification key={index} notification={notification} />
                ))
              ) : (
                <div className="text-center mt-10 text-gray-500">
                  No hay notificaciones
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Notificaciones;

// import { motion, AnimatePresence } from 'framer-motion'
// import { useState } from 'react';
// import axios from 'axios';
// import Notification from '../components/Notification'

// function Notificaciones({onClose, notificaciones}) {
//     const handleContentClick = (e) => {
//         e.stopPropagation();
//     };

//     // Handle change event to update the selected role
//     const handleChange = (e) => {
//         setSelectedRole(e.target.value);
//     };
//     useEffect(() => {
//         const storedUser = localStorage.getItem("usuario");
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       }, []);
    
//     useEffect(() => {
//         if (user && user.idUsuario) {
//           cargarUsuarioYAlertas();
//         }
//       }, [user]);
    
//     const cargarUsuarioYAlertas = async () => {
//         if (user.idUsuario) {
    
//           console.log("Cargando notificaciones...", user.idUsuario);
    
//           try {
//             const id = parseInt(user.idUsuario, 10);
//             console.log("Obteniendo notificaciones no leídas para el usuario:", id);
//             const response = await fetch(
//               `http://localhost:3001/notificaciones/alertas/${id}`,{headers: {
//         "Authorization": `Bearer ${token}`
//       } }
//             );
//             const data = await response.json();
//             console.log("Notificaciones:", data);
//             notif(data.resultado || []);
//           } catch (error) {
//             console.error("Error al obtener notificaciones:", error);
//           }
//         }
//       };
//     const notif = async (notificaciones) => {
//         for (let i = 0; i < notificaciones.length; i++) {
//           const notificacion = notificaciones[i];
//           if (notificacion.leida === false) {
//             //await new Promise(resolve => setTimeout(resolve, 6000));
//             toast.warn(`${notificacion.mensaje}`);
//           }
//         }
//       };
//     return (
//         <AnimatePresence>
//             <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
//             initial={{ opacity: 0}}
//             animate={{opacity: 1}}
//             transition={{ duration: 0.2 }}>
//                 <motion.div className="bg-white rounded-xl w-[60%] h-[80%]" onClick={handleContentClick}
//                 initial={{ opacity: 0, scale: 0.3}}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, size: 0}}
//                 transition={{ duration: 0.2 }}>
//                     <div className='h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3'>
//                         <h1 className='cursor-pointer text-[20px]' onClick={onClose}>x</h1>
//                     </div>
//                     <div className='h-[15%] w-full flex justify-center items-center text-[2rem]'>Notificaciones</div>
//                     <div className='h-[75%] w-full px-10'>
//                         <div className="h-full overflow-y-auto">
//                             {notificaciones.map((notification, index) => (
//                             <Notification key={index} notification={notification} />
//                             ))}
//                         </div>
//                         </div>
                
//                 </motion.div>
//             </motion.div>
//         </AnimatePresence>
//     )
// }

// export default Notificaciones