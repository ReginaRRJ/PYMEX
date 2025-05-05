import { motion } from 'framer-motion'
import { useState, useEffect } from "react"

import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function NotificacionesDist() {
    // First setting
    const [notificacionesEntrega, setNotificacionesEntrega] = useState(false)
    const [entregaEstimada, setEntregaEstimada] = useState("10")

    // Second setting
    const [automatizacionNotificacion, setAutomatizacionNotificacion] = useState(false)
    const [notificacionesProvClien, setNotificacionesProvClien] = useState([])

    // First switch
    const handleEntrega = (e, entregaEstimada) => {
        if (entregaEstimada !== null) {
            setEntregaEstimada(entregaEstimada);
        }
    }

    const handleNotificaciones = (e, notificationSetting) => {
        setNotificacionesProvClien(notificationSetting)
    }

    // Used to block the selection when the 1st switch is off
    useEffect(() => {
        if (!notificacionesEntrega) {
          setEntregaEstimada(null);
        }
      }, [notificacionesEntrega]);

    // Used to block the selection when the 2nd switch is off
    useEffect(() => {
        if (!automatizacionNotificacion) {
          setNotificacionesProvClien(null);
        }
      }, [automatizacionNotificacion]);

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Notificaciones</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Activa notificaciones para facilitar la gestión</h1>  
                </div>
            </div>

            <div className="w-full h-[75%]">
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={notificacionesEntrega}  onChange={(e) => setNotificacionesEntrega(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Alertas de Entrega estimada</h1>
                        <h1 className='text-[12px]'>Alerta de notificación antes del tiempo establecido de Fecha Estimada</h1>
                    </div>
                    <div className='w-[30%] h-full flex flex-col justify-center pl-[30px]'>
                        <ToggleButtonGroup
                            color="primary"
                            value={entregaEstimada}
                            exclusive
                            onChange={handleEntrega}
                            >
                            <ToggleButton value="10" disabled={!notificacionesEntrega}>10H</ToggleButton>
                            <ToggleButton value="15" disabled={!notificacionesEntrega}>15H</ToggleButton>
                            <ToggleButton value="20" disabled={!notificacionesEntrega}>20H</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                </div>
                <br />

                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large'  checked={automatizacionNotificacion}  onChange={(e) => setAutomatizacionNotificacion(e.target.checked)} />
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center bg-'>
                        <h1 className='text-[18px] font-bold'>Automatización a Proveedor/Cliente</h1>
                        <h1 className='text-[12px]'>Automatización de notificación a proveedor o cliente al momento de realizar la entrega</h1>
                    </div>
                    <div className='w-[30%] h-full flex flex-col justify-center pl-[30px]'>
                        <ToggleButtonGroup
                            color="primary"
                            value={notificacionesProvClien}
                            onChange={handleNotificaciones}
                            aria-label="Platform"
                            multiple
                            >
                            <ToggleButton value="Proveedor" disabled={!automatizacionNotificacion}>Proveedor</ToggleButton>
                            <ToggleButton value="Cliente" disabled={!automatizacionNotificacion}>Cliente</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default NotificacionesDist
