import { motion } from 'framer-motion'
import { useState } from "react"

function NotificacionesDist() {

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Notificaciones</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Activa notifiicaciones para facilitar la gestión</h1>  
                </div>
            </div>

            <div className="w-full h-[75%] bg-slate-500">
            </div>
        </motion.div>
    )
}

export default NotificacionesDist
