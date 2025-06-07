import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import market from "../../assets/market-color.png";
import { toast } from "react-toastify";
const token = localStorage.getItem('token');
function StockSucursal() {
  const [producto, setProducto] = useState(null);
  const [montoStock, setMontoStock] = useState(null);
  const [user, setUser] = useState(null);
  const[sucursal, setSucursal] = useState("");
  const [options, setOptions] = useState([]);

  const handleInterval = (event) => {
    setProducto(Number(event.target.value));
  };
 

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
      const parsed = JSON.parse(storedUser);
      console.log("Usuario cargado:", parsed);
      setUser(parsed);
      setSucursal(parsed.idSucursal);
    } catch (err) {
      console.error("Error al parsear usuario:", err);
    }
    }
  }, []);

  // Cargar lista de productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/sucursal/productos", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
        const productos = res.data || [];

        // Formatear para el select
        const formattedOptions = productos.map((producto) => ({
          label: producto.nombreProductoo,
          value: producto.nombreProducto,
          idProducto: producto.idProducto,
        }));


        setOptions(formattedOptions);

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


  // Cargar stock cuando haya usuario y producto seleccionados
  useEffect(() => {
    if (!user || !producto || options.length === 0) return;

    const selectedOption = options.find((option) => option.idProducto === producto);
    const idProducto = selectedOption?.idProducto;
    if (!idProducto) return;

    const fetchStock = async () => {
      console.log("Cargando stock para producto:", sucursal, idProducto);
      try {
        if (!user) return null; // o un loader
        
        console.log("Cargando stock para producto:", sucursal, producto);

        const res = await axios.get(
          `http://localhost:3001/api/sucursal/stock/${sucursal}/${idProducto}`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
}
        );

        const primerResultado = res.data?.[0];
        const monto = primerResultado?.cantidadDisponible ?? 0;
        console.log("STOCK OBTENIDO:", monto);
        toast.success("Stock cargado correctamente", monto);
        setMontoStock(monto);
      } catch (error) {
        console.error("Error al cargar stock:", error);
        toast.error("Error al cargar stock");
      }
    };

    fetchStock();
  }, [sucursal, producto, options]);

  return (
    <motion.div
      className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Stock</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Visualiza métricas de esta sucursal</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        <div className="w-full h-[30%] pt-[40px]">
          <select
            value={producto || ""}
            onChange={handleInterval}
            className="w-[15em] h-[2.5em] border-none rounded-md pl-[10px] bg-slate-200"
          >
            {options.map((option) => (
              <option key={option.idProducto} value={option.idProducto}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex">
          <div className="w-[20%] flex flex-col items-center">
            <img src={market} alt="" className="w-[50%]" />
            <h1 className="font-bold">Apodaca</h1>
            <h1 className="text-[0.8rem] text-center">
              Apodaca, Nuevo León, México
            </h1>
            <br />
            <h1>Existen {montoStock} unidades.</h1>
          </div>
          <div className="w-[10%]"></div>
          <div className="w-[30%] rounded-2xl px-2 py-2 bg-slate-200">
            <h1 className="text-[1.5rem] font-bold text-center">Predicción</h1>
            <h1 className="text-center">Lorem ipsum dolor sit amet..</h1>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StockSucursal;
