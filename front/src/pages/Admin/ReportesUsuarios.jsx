import React, { useEffect, useState } from "react";
import Report from "../../components/Report";
import { motion } from 'framer-motion';
import process from 'process';


function ReportesUsuarios() {
    const [reportes, setReportes] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const currentToken = localStorage.getItem('token');
                const response = await fetch("http://localhost:3001/reportes", {
                    headers: {
                        "Authorization": `Bearer ${currentToken}`
  }
});
                const data = await response.json();
                console.log("Reportes recibidos:", data);
                setReportes(data);
            } catch (error) {
                console.error("Error al obtener reportes:", error);
            }
        };

        fetchReportes();
    }, []);

    return (
        <motion.div 
            className="h-full w-[100%] flex flex-col pt-[6vh] pr-[50px]" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
        >
            <div className="h-[20%] w-full">
                <h1 className="text-[40px] font-bold">Reportes</h1>
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h2 className="text-lg">Reportes sobre funcionamiento</h2>
                </div>
            </div>


            <div id="info-reporte" className="h-[70%] w-full overflow-y-auto">
                {Array.isArray(reportes) && reportes.length > 0 ? ( 
                reportes
                    .sort((a, b) => a.resuelto - b.resuelto) 
                    .map((reporte, index) => (
                        <Report 
                            key={reporte.idReporte || index} 
                            reporte={reporte} 
                            index={index} 
                        />

                    ))
            ) : (
                <p>No hay reportes disponibles.</p>
            )}
            </div>
            
        </motion.div>
    );
}

export default ReportesUsuarios;

