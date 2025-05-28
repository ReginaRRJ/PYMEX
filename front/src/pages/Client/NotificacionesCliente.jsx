import { motion } from 'framer-motion'
import { useState, useEffect } from "react"

import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function NotificacionesCliente() {
    // First setting
    const [anticipacion, setAnticipacion] = useState(false)
    const [automatizacion, setAutomatizacion] = useState(false)
    const [estatus, setEstatus] = useState(false)
    const [solicitudes, setSolicitududes] = useState(false)

    // First switch
    const handleEntrega = (e, entregaEstimada) => {
        if (entregaEstimada !== null) {
            // setEntregaEstimada(entregaEstimada);
        }
    }

    const handleNotificaciones = (e, notificationSetting) => {
        // setNotificacionesProvClien(notificationSetting)
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
                        <Switch size='large' checked={anticipacion}  onChange={(e) => setAnticipacion(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Anticipación de pedidos a distribuidor</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={automatizacion}  onChange={(e) => setAutomatizacion(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidos</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={estatus}  onChange={(e) => setEstatus(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación cada vez que se actualiza el estado de pedidos a distribuidor.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={solicitudes}  onChange={(e) => setSolicitududes(e.target.checked)}/>
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