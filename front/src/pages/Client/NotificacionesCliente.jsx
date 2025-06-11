import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import Switch from '@mui/material/Switch';



function NotificacionesCliente() {
    const [user, setUser] = useState(null);
    const [anticipacion, setAnticipacion] = useState(false);
    const [automatizacion, setAutomatizacion] = useState(false);
    const [estatus, setEstatus] = useState(false);
    const [solicitudes, setSolicitududes] = useState(false);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log("User loaded from localStorage:", parsedUser);
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
                localStorage.removeItem("usuario");
            }
        }
    }, []);

    useEffect(() => {
        if (!user || !user.idUsuario) {
            console.warn("Usuario no disponigle o inválido.");
            setAnticipacion(false);
            setAutomatizacion(false);
            setEstatus(false);
            setSolicitududes(false);
            return;
        }

        const fetchNotificationConfig = async () => {
           
            try {
                const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
                const contentType = response.headers.get("content-type");

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error HTTP: ${response.status}, Mensaje: ${errorText}`);
                    return;
                }

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error('Esperando archivo JSON. Se recibió:', text);
                    return;
                }

                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    console.error("Los datos obtenidos no sun un arreglo:", data);
                    return;
                }

                data.forEach(config => {
                    

                    switch (config.idNotificacion) {
                        case 7:
                            setAnticipacion(config.activo);
                            break;
                        case 8:
                            setAutomatizacion(config.activo);
                            break;
                        case 9:
                            setEstatus(config.activo);
                            break;
                        case 10:
                            setSolicitududes(config.activo);
                            break;
                        default:
                            console.warn(`Notificación desconocida: ${config.idNotificacion}`);
                            break;
                    }
                });
            } catch (error) {
                console.error("Error obteniendo configuración de la notificación:", error);
            }
        };

        fetchNotificationConfig();
    }, [user]);

    const handleSwitchChange = async (idNotificacion, value) => {
        if (!user || !user.idUsuario) {
            console.error("Usuario no disponible. No se puede actualizar la notificación.");
            alert("Datos del usuario no disponibles. Inicie sesión de nuevo");
            return;
        }

        const newValue = value; 

        if (idNotificacion === 7) setAnticipacion(newValue);
        else if (idNotificacion === 8) setAutomatizacion(newValue);
        else if (idNotificacion === 9) setEstatus(newValue);
        else if (idNotificacion === 10) setSolicitududes(newValue);


        try {
            const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idNotificacion: idNotificacion,
                    activo: newValue, 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            console.log("Notificación actualizada exitosamente.");

        } catch (error) {
            console.error("Error actualizando notificación:", error);
            if (idNotificacion === 7) setAnticipacion(!newValue);
            else if (idNotificacion === 8) setAutomatizacion(!newValue);
            else if (idNotificacion === 9) setEstatus(!newValue);
            else if (idNotificacion === 10) setSolicitududes(!newValue);
            alert("Error actualizando notificación. Por favor intente de nuevo");
        }
    };

    if (!user) {
        return <div>Cargando datos del usuario...</div>;
    }

    return (
        <motion.div className="h-full w-full flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Notificaciones</h1>
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Activa notificaciones para facilitar la gestión</h1>
                </div>
            </div>
            <div className="w-full h-[75%]">
               
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={anticipacion} onChange={(e) => handleSwitchChange(7, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Anticipación de pedidos a distribuidor</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
               
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={automatizacion} onChange={(e) => handleSwitchChange(8, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
               
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={estatus} onChange={(e) => handleSwitchChange(9, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación cada vez que se actualiza el estado de pedidos a distribuidor.</h1>
                    </div>
                </div>
                <br />
                
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={solicitudes} onChange={(e) => handleSwitchChange(10, e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Solicitudes de autorización</h1>
                        <h1 className='text-[12px]'>Alerta de notificación para las solicitudes de autorización.</h1>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default NotificacionesCliente;