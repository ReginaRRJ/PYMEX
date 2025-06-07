import { motion } from "framer-motion"; 
import { useState, useEffect } from "react";
import sucursalesData from "./sucursales";
import Sucursal from "./Sucursal";
import axios from "axios";

function SucursalCliente() {
  const [periodo, setPeriodo] = useState("Ventas mensuales");
  const [sucursales, setSucursales] = useState(sucursalesData);

  const handleInterval = (event) => {
    setPeriodo(event.target.value);
  };

  const options = [
    { label: "Ventas semanales", value: "Ventas semanales" },
    { label: "Ventas mensuales", value: "Ventas mensuales" },
    { label: "Ventas anuales", value: "Ventas anuales" },
  ];

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

  return (
    <motion.div
      className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Ventas</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Visualiza métricas de esta sucursal</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        <div className="w-full h-[30%] pt-[40px]">
          <select
            value={periodo}
            onChange={handleInterval}
            className="w-[15em] h-[2.5em] border-none rounded-md pl-[10px] bg-slate-200"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full h-[70%] flex overflow-x-auto">
          {sucursales.map((sucursal) => (
            <Sucursal
              sucursal={sucursal}
              mode={"ventas"}
              periodo={periodo}
            ></Sucursal>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default SucursalCliente;
