import { motion } from "framer-motion"
import { useState } from "react"
import sucursalesData from "./sucursales";
import Sucursal from "./Sucursal";
import sucursales from "./sucursales";
import productsData from "./products";

function StockCliente() {
    const [productos, setProductos] = useState(productsData);
    const [producto, setProducto] = useState("")
    const [sucursales, setSucursales] = useState(sucursalesData)
    
    const handleProduct = (event) => {
        setProducto(event.target.value);
      };

    return (
        <motion.div className="h-full w-full flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Stock</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Visualiza métricas de esta sucursal</h1>  
                </div>
            </div>

            <div className="w-full h-[75%]">
               <div className="w-full h-[30%] pt-[40px]">
                    <select value={producto} onChange={handleProduct} className="w-[15em] h-[2.5em] border-none rounded-md pl-[10px] bg-slate-200">
                    {productos.map((producto) => (
                        <option key={producto.value} value={producto.value}>
                        {producto.name}
                        </option>
                    ))}
                    </select>
               </div>
               <div className="w-full h-[70%] flex overflow-x-auto">
                    {sucursales.map((sucursal) => (
                        <Sucursal sucursal={sucursal} mode={"unidades"}></Sucursal>
                    ))}
               </div>
            </div>
        </motion.div>
    )
}

export default StockCliente
