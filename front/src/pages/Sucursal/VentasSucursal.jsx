import { motion } from "framer-motion"
import { useState } from "react"

import market from '/assets/market-color.png'

function VentasSucursal() {
    const [ventas, setVentas] = useState("mensuales");

    const handleInterval = (event) => {
        setVentas(event.target.value);
      };

    const options = [
        { label: "Ventas semanales", value: "semanal" },
        { label: "Ventas mensual", value: "mensual" },
        { label: "Ventas anuales", value: "anual" }
    ];

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Sucursales</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Visualiza métricas de esta sucursal</h1>  
                </div>
            </div>

            <div className="w-full h-[75%]">
               <div className="w-full h-[30%] pt-[40px]">
                    <select value={ventas} onChange={handleInterval} className="w-[15em] h-[2.5em] border-none rounded-md pl-[10px] bg-slate-200">
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
               </div>
               <div className="w-full h-[60%] flex">
                    <div className="w-[20%] h-full flex flex-col items-center">
                        <img src={market} alt="" className="w-[50%]"/>
                        <h1 className="font-bold">Apodaca</h1>
                        <h1 className="text-[0.8rem] text-center">Apodaca, Nuevo León, México</h1>
                        <br />
                        <h1>$339,714 MXN</h1>
                    </div>
                    <div className="w-[10%] h-full">
                    </div>
                    <div className="w-[30%] h-full">
                       <h1 className="text-[5rem] font-bold text-center">50%</h1>
                       <h1 className="text-center">De aumento en ventas con respecto al mes pasado</h1> 
                       <h1 className="font-bold underline cursor-pointer text-center">Ver bitácora</h1>
                    </div>
               </div>
            </div>
        </motion.div>
    )
}

export default VentasSucursal
