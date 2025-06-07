import { motion } from "framer-motion"
import { useState, useEffect } from "react" 
import sucursalesData from "./sucursales";
import SucursalStock from "./SucursalStock.jsx";
import sucursales from "./sucursales";
import productsData from "./products";
import axios from "axios";
import { toast } from "react-toastify";

function StockCliente() {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState("")
    const [sucursales, setSucursales] = useState(sucursalesData);
    
    const handleProduct = (event) => {
        setProducto(event.target.value);
    };
    
    //Traer las sucursales de esa pyme
    useEffect(() => {
        const fetchSucursales = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("usuario"));
            const idPyme = user?.idPyme;

            if (!idPyme) {
            console.warn("No se encontró idPyme en el usuario");
            return;
            }

            const response = await axios.get(
            `http://localhost:3001/api/sucursales/pyme/${idPyme}`
            );
            console.log("Sucursales recibidas:", response.data);

            const dataTransformada = response.data.map((sucursal) => ({
            id: sucursal.idSucursal,
            ubicacion: sucursal.nombreSucursal,
            ubicacion_completa: sucursal.ubicacionSucursal,
            ventas: 10000, // valor temporal o puedes traerlo de otro endpoint
            unidades: 150, // valor temporal o puedes traerlo de otro endpoint
            }));

            setSucursales(dataTransformada);
        } catch (error) {
            console.error("Error al obtener sucursales:", error.message);
        }
        };

        fetchSucursales();
    }, []);

    useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/sucursal/productos");
        const productos = res.data || [];

        // Formatear para el select
        const formattedOptions = productos.map((producto) => ({
          label: producto.nombreProductoo,
          value: producto.idProducto,
          idProducto: producto.idProducto,
        }));


        setProductos(formattedOptions);

        // Establecer producto por defecto si hay al menos uno
        if (formattedOptions.length > 0) {
          setProducto(formattedOptions[0].idProductoo);
        }

        console.log("Productos obtenidos:", productos);
        console.log("Opciones mapeadas:", formattedOptions);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

    

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
                    {productos.map((productos) => (
                        <option key={productos.value} value={productos.value}>
                        {productos.label}
                        </option>
                    ))}
                    </select>
               </div>
               <div className="w-full h-[70%] flex overflow-x-auto">
                    {sucursales.map((sucursal) => (
                        <SucursalStock
                            key={sucursal.id}
                            sucursal={sucursal}
                            producto={producto}
                        />
                    ))}
               </div>
            </div>
        </motion.div>
    )
}

export default StockCliente