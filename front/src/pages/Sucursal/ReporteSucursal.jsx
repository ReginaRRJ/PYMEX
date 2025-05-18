import { motion } from "framer-motion"
import { useState } from "react"

import market from '/assets/market-color.png'

function ReporteSucursal() {
    const [prioridad, setPrioridad] = useState(0);

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Reportar</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Notifica cada vez que tengas algún error en  el software</h1>  
                </div>
            </div>

            <div className="w-full h-[75%] flex flex-col justify-between">
               <div className="w-full h-[15%] flex items-center justify-between">
               <input 
                className="w-[40%] h-[80%] bg-slate-200 rounded-lg pl-2" 
                placeholder="Título" 
                />
                <div className="w-[30%] h-[80%] flex justify-between">
                    <button className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${prioridad == 1 ? 'bg-green-400' : 'bg-slate-200' } hover:bg-green-400 duration-300`} onClick={() => setPrioridad(1)}>!</button>
                    <button className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${prioridad == 2 ? 'bg-yellow-400' : 'bg-slate-200' } hover:bg-yellow-400 duration-300`} onClick={() => setPrioridad(2)}>!!</button>
                    <button className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${prioridad == 3 ? 'bg-red-400' : 'bg-slate-200' }  hover:bg-red-400 duration-300`} onClick={() => setPrioridad(3)}>!!!</button>
                </div>
               </div>
               <div className="w-full h-[70%]">
                <textarea className="w-full h-full rounded-lg px-[1rem] py-[1rem] resize-none bg-slate-200" spellCheck={false} placeholder="Descripción del error"/>
               </div>
               <button className="w-full h-[10%] rounded-2xl text-white bg-blue-600">
                <h1 className="text-[25px]">Enviar</h1>
               </button>

            </div>
        </motion.div>
    )
}

export default ReporteSucursal
