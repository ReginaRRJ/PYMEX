import market from "/assets/market-color.png";
import { useState, useEffect } from "react"; 
import axios from "axios";



function Sucursal({ sucursal, mode, periodo }) {
  const [montoVentas, setMontoVentas] = useState(0);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchVentas = async () => { 
      try {
        const rutaBase = "http://localhost:3001/api/sucursal";
        let endpoint = "";

        if (periodo === "Ventas anuales") {
          endpoint = `${rutaBase}/ventas-anuales/${sucursal.id}`;
        } else if (periodo === "Ventas mensuales") {
          endpoint = `${rutaBase}/ventas-mensuales/${sucursal.id}`;
        } else {
          endpoint = `${rutaBase}/ventas-semanales/${sucursal.id}`;
        }

        const res = await axios.get(endpoint, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
        const primerResultado = res.data?.[0];
        const monto = primerResultado?.totalVentas ?? 0;
        setMontoVentas(monto);
      } catch (error) {
        console.error(
          `Error al cargar ventas de sucursal ${sucursal.id}:`,
          error
        );
      }
    };

    fetchVentas();
  }, [sucursal.id, periodo]);

  return (
    <div className="w-[33%] h-full flex-shrink-0 flex flex-col items-center mr-5">
      <img src={market} alt="" className="w-[50%]" />
      <h1 className="font-bold">{sucursal.ubicacion}</h1>
      <h1 className="text-[0.8rem] text-center">
        {sucursal.ubicacion_completa}
      </h1>
      <br />
      {mode === "unidades" ? (
        <h1>{sucursal.unidades} unidades</h1>
      ) : (
        <h1>${montoVentas.toLocaleString()} MXN</h1>
      )}
    </div>
  );
}

export default Sucursal;
