import { motion } from 'framer-motion'
import { useState, useEffect } from "react"

import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function NotificacionesCliente() {
    // First setting
    const [user, setUser] = useState(null);
    const [anticipacion, setAnticipacion] = useState(false)
    const [automatizacion, setAutomatizacion] = useState(false)
    const [estatus, setEstatus] = useState(false)
    const [solicitudes, setSolicitududes] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUser(JSON.parse(storedUser));  
        }
    }, []);

    useEffect(() => {
        if (!user) return;
    
            const fetchNotificationConfig = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`);
                const contentType = response.headers.get("content-type");
        
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error('Expected JSON, but received:', text);
                    return;
                }
        
                const data = await response.json();
        
                // Use ID mapping to assign correct states
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
                            break;
                    }
                });
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        
    
        fetchNotificationConfig();
    }, [user]);

        const handleSwitchChange = async (idNotificacion, value) => {
        // Optimistically update local state first
        if (idNotificacion === 7) setAnticipacion(value);
        if (idNotificacion === 8) setAutomatizacion(value);
        if (idNotificacion === 9) setEstatus(value);
        if (idNotificacion === 10) setSolicitududes(value);
    
        try {
            await fetch(`http://localhost:3001/api/notificaciones/configuracion-notificaciones/${user.idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idNotificacion,
                    activo: value,
                }),
            });
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };
    

    if (!user) {
        return <div>Loading...</div>;
    }
    // // First switch
    // const handleEntrega = (e, entregaEstimada) => {
    //     if (entregaEstimada !== null) {
    //         // setEntregaEstimada(entregaEstimada);
    //     }
    // }

    // const handleNotificaciones = (e, notificationSetting) => {
    //     // setNotificacionesProvClien(notificationSetting)
    // }

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
                        <Switch size='large' checked={anticipacion} onChange={(e) => handleSwitchChange(7, e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Anticipación de pedidos a distribuidor</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={automatizacion} onChange={(e) => handleSwitchChange(8, e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={estatus} onChange={(e) => handleSwitchChange(9, e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación cada vez que se actualiza el estado de pedidos a distribuidor.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={solicitudes} onChange={(e) => handleSwitchChange(10, e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Solicitudes de autorización</h1>
                        <h1 className='text-[12px]'>Alerta de notificación para las solicitudes de autorización.</h1>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default NotificacionesCliente