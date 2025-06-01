import market from "/assets/market-color.png"; 
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SucursalStock({ sucursal, producto }) {
  const [montoStock, setMontoStock] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || !producto) return;

    const fetchStock = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/sucursal/stock/${sucursal.id}/${producto}`
        );
        const primerResultado = res.data?.[0];
        const monto = primerResultado?.cantidadDisponible ?? 0;
        setMontoStock(monto);
      } catch (error) {
        console.error("Error al cargar stock:", error);
        toast.error("Error al cargar stock");
      }
    };

    fetchStock();
  }, [sucursal, producto]);

  return (
    <div className="w-[33%] h-full flex-shrink-0 flex flex-col items-center mr-5">
      <img src={market} alt="" className="w-[50%]" />
      <h1 className="font-bold">{sucursal.ubicacion}</h1>
      <h1 className="text-[0.8rem] text-center">{sucursal.ubicacion_completa}</h1>
      <br />
      <h1>{montoStock} unidades</h1>
    </div>
  );
}

export default SucursalStock;
