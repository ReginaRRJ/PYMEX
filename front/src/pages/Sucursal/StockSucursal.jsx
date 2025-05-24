import { motion } from "framer-motion"
import { useState } from "react"

import market from '../../assets/market-color.png'

function StockSucursal() {
    const [producto, setProducto] = useState("iPhone 13 (128GB)");
    const [montoStock, setMontoStock] = useState(null);
    const [user, setUser] = useState(null);

    const handleInterval = (event) => {
        setProducto(event.target.value);
    };


    //por conectar a la base de datos
    const options = [
        { label: "iPhone 13 (128GB)", value: "iPhone 13 (128GB)" },
        { label: "Samsung S20", value: "Samsung S20" },
        { label: "Sony 1000XM4", value: "Sony 1000XM4" }
    ];

    useEffect(() => {
        const storedUser=localStorage.getItem("usuario");
        if (storedUser){
            setUser(JSON.parse(storedUser));
        }
        const fetchStock = async () => {
            try{
                const res = await axios.get(`http://localhost:3001/api/sucursal/stock/${user.idPyme}/${idProducto}`);
                console.log("Respuesta de stock:", res.data); // 🔍 inspecciona estructura
                const primerResultado = res.data?.[0];
                const monto = primerResultado?.totalVentas ?? 0;
                setMontoStock(monto);
            } catch (error) {
                console.error("Error al cargar stock:", error);
            }
        }

    }, [producto]);

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Stock</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Visualiza métricas de esta sucursal</h1>  
                </div>
            </div>

            <div className="w-full h-[75%]">
               <div className="w-full h-[30%] pt-[40px]">
                    <select value={producto} onChange={handleInterval} className="w-[15em] h-[2.5em] border-none rounded-md pl-[10px] bg-slate-200">
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
               </div>
               <div className="w-full flex">
                    <div className="w-[20%] flex flex-col items-center">
                        <img src={market} alt="" className="w-[50%]"/>
                        <h1 className="font-bold">Apodaca</h1>
                        <h1 className="text-[0.8rem] text-center">Apodaca, Nuevo León, México</h1>
                        <br />
                        <h1>5 unidades</h1>
                    </div>
                    <div className="w-[10%]">
                    </div>
                    <div className="w-[30%] rounded-2xl px-2 py-2 bg-slate-200">
                       <h1 className="text-[1.5rem] font-bold text-center">Predicción</h1>
                       <h1 className="text-center">Lorem ipsum dolor sit amet..</h1> 
                    </div>
               </div>
            </div>
        </motion.div>
    )
}

export default StockSucursal