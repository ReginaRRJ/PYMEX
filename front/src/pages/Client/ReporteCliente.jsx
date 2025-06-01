import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import market from "/assets/market-color.png";

function ReporteCliente() {
  const [prioridad, setPrioridad] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const crearReporte = async () => {
    try {
      const datos = {
        titulo: titulo,
        descripcion: descripcion,
        urgencia: prioridad,
        prioridad: prioridad,
        resuelto: false,
        detalleSolucion: "sin solución",
        idUsuario: user.idUsuario,
        idPyme: user.idPyme,
        fechaReporte: new Date().toISOString(),
        fechaResolucion: null,
      };

      const res = await axios.post(
        `http://localhost:3001/reportes/pedido`,
        datos
      );
      console.log("Reporte creado:", res.data);
      toast.success("Reporte creado correctamente");

      setPrioridad(0);
      setTitulo("");
      setDescripcion("");
    } catch (error) {
      console.error(
        "Error al crear reporte:",
        error.response?.data || error.message
      );
      if (titulo === "") {
        toast.error("Error, asigna un título");
      } else if (descripcion === "") {
        toast.error("Error, asigna una descripción");
      } else if (prioridad === 0) {
        toast.error("Error, selecciona una prioridad");
      } else {
        toast.error("Error al crear el reporte");
      }
    }
  };

  return (
    <motion.div
      className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Reportar</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Notifica cada vez que tengas algún error en el software</h1>
        </div>
      </div>

      <div className="w-full h-[75%] flex flex-col justify-between">
        <div className="w-full h-[15%] flex items-center justify-between">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-[40%] h-[80%] bg-slate-200 rounded-lg pl-2"
            placeholder="Título"
          />
          <div className="w-[30%] h-[80%] flex justify-between">
            <button
              className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${
                prioridad == 1 ? "bg-green-400" : "bg-slate-200"
              } hover:bg-green-400 duration-300`}
              onClick={() => setPrioridad(1)}
            >
              !
            </button>
            <button
              className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${
                prioridad == 2 ? "bg-yellow-400" : "bg-slate-200"
              } hover:bg-yellow-400 duration-300`}
              onClick={() => setPrioridad(2)}
            >
              {" "}
              !!
            </button>
            <button
              className={`w-[30%] h-full rounded-xl flex items-center justify-center text-[20px] ${
                prioridad == 3 ? "bg-red-400" : "bg-slate-200"
              }  hover:bg-red-400 duration-300`}
              onClick={() => setPrioridad(3)}
            >
              !!!
            </button>
          </div>
        </div>
        <div className="w-full h-[70%]">
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full h-full rounded-lg px-[1rem] py-[1rem] resize-none bg-slate-200"
            spellCheck={false}
            placeholder="Descripción del error"
          />
        </div>
        <button
          className="w-full h-[10%] rounded-2xl text-white bg-blue-600"
          onClick={crearReporte}
        >
          <h1 className="text-[25px]">Enviar</h1>
        </button>
      </div>
    </motion.div>
  );
}

export default ReporteCliente;
