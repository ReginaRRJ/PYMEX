import { motion } from 'framer-motion'
import { useState, useEffect } from "react"

import Switch from '@mui/material/Switch';

function NotificacionesSucursal() {
    const [pedidoAutorizado, setPedidoAutorizado] = useState(false);
    const [automatizacionPedidos, setAutomatizacionPedidos] = useState(false);
    const [estatusPedido, setEstatusPedido] = useState(false);


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
                        <Switch size='large' checked={pedidoAutorizado}  onChange={(e) => setPedidoAutorizado(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Pedido Autorizado</h1>
                        <h1 className='text-[12px]'>Estado de autorización de los pedidos de la sucursal</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={automatizacionPedidos}  onChange={(e) => setAutomatizacionPedidos(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Automatización de pedidoso</h1>
                        <h1 className='text-[12px]'>Automatización en momento calculado para evitar desabasto.</h1>
                    </div>
                </div>
                <br />
                <div className='w-full h-[20%] flex items-center rounded-md bg-slate-200'>
                    <div className='w-[80px] h-full flex flex-col justify-center'>
                        <Switch size='large' checked={estatusPedido}  onChange={(e) => setEstatusPedido(e.target.checked)}/>
                    </div>
                    <div className='w-[40%] h-full flex flex-col justify-center'>
                        <h1 className='text-[18px] font-bold'>Estatus del pedido</h1>
                        <h1 className='text-[12px]'>Alerta de notificación en cada actualización del proceso de envio</h1>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default NotificacionesSucursal
