import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

import market from "../../assets/market-color.png";

function VentasSucursal() {
  const [ventas, setVentas] = useState("anual");
  const [montoVentas, setMontoVentas] = useState(null);
  const [user, setUser] = useState(null);
  const [sucursal, setSucursal] = useState("");

  const handleInterval = (event) => {
    setVentas(event.target.value);
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

  const options = [
    { label: "Ventas semanales", value: "semanal" },
    { label: "Ventas mensual", value: "mensual" },
    { label: "Ventas anuales", value: "anual" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const fetchVentas = async () => {
      if (ventas === "anual") {
        try {
          const res = await axios.get(
            `http://localhost:3001/api/sucursal/ventas-anuales/${sucursal}`
          );
          console.log("Respuesta de ventas anuales:", res.data); // 🔍 inspecciona estructura
          const primerResultado = res.data?.[0];
          const monto = primerResultado?.totalVentas ?? 0;
          setMontoVentas(monto);
        } catch (error) {
          console.error("Error al cargar ventas anuales:", error);
        }
      } else if (ventas === "mensual") {
        try {
          const res = await axios.get(
            `http://localhost:3001/api/sucursal/ventas-mensuales/${sucursal}`
          );

          console.log("Respuesta de ventas mensuales:", res.data); // 🔍 inspecciona estructura
          const primerResultado = res.data?.[0];
          const monto = primerResultado?.totalVentas ?? 0;
          setMontoVentas(monto);
        } catch (error) {
          console.error("Error al cargar ventas mensuales:", error);
        }
      } else {
        try {
          const res = await axios.get(
            `http://localhost:3001/api/sucursal/ventas-semanales/${sucursal}`
          );

          console.log("Respuesta de ventas semanales:", res.data); // 🔍 inspecciona estructura
          const primerResultado = res.data?.[0];
          const monto = primerResultado?.totalVentas ?? 0;
          setMontoVentas(monto);
        } catch (error) {
          console.error("Error al cargar ventas semanales:", error);
        }
      }
    };

    fetchVentas();
  }, [ventas]);

  return (
    <motion.div
      className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Sucursales</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Visualiza métricas de esta sucursal</h1>
        </div>
      </div>

      <div className="w-full h-[75%]">
        <div className="w-full h-[30%] pt-[40px]">
          <select
            value={ventas}
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
        <div className="w-full h-[60%] flex">
          <div className="w-[20%] h-full flex flex-col items-center">
            <img src={market} alt="" className="w-[50%]" />
            <h1 className="font-bold">Apodaca</h1>
            <h1 className="text-[0.8rem] text-center">
              Apodaca, Nuevo León, México
            </h1>
            <br />
            <h1>
              {montoVentas !== null
                ? `$${Number(montoVentas).toLocaleString("es-MX")} MXN`
                : "$ -"}
            </h1>
          </div>
          <div className="w-[10%] h-full"></div>
          <div className="w-[30%] h-full">
            <h1 className="text-[5rem] font-bold text-center">50%</h1>
            <h1 className="text-center">
              De aumento en ventas con respecto al mes pasado
            </h1>
            <h1 className="font-bold underline cursor-pointer text-center">
              Ver bitácora
            </h1>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VentasSucursal;
