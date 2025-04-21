import React, { useEffect, useState } from "react";
import Report from "../../components/Report";

function ReportesUsuarios() {
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await fetch("http://localhost:3001/reportes");
                const data = await response.json();
                console.log("📦 Reportes recibidos:", data);
                setReportes(data);
            } catch (error) {
                console.error("❌ Error al obtener reportes:", error);
            }
        };

        fetchReportes();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Lista de reportes</h1>
            {Array.isArray(reportes) && reportes.length > 0 ? (
                reportes.map((reporte, index) => (
                    <Report key={reporte.idReporte} reporte={reporte} index={index} />
                ))
            ) : (
                <p>No hay reportes disponibles.</p>
            )}
        </div>
    );
}

export default ReportesUsuarios;
// import { useState, useEffect } from "react";
// //import { getReporte } from "../../../../controllers/adminReport";  // Adjust the import path based on where your file is located
// import Report from '../../components/Report';
// import { motion } from 'framer-motion';
// import process from 'process';


// function ReportesUsuarios() {
//     const [reportes, setReportes] = useState([]);
//     useEffect(() => {
//         const fetchReportes = async () => {
//             try {
//                 const response = await fetch("http://localhost:3001/reportes");
//                 const data = await response.json();
//                 setReportes(data);
//             } catch (error) {
//                 console.error("Error fetching reports:", error);
//             }
//         };

//         fetchReportes();
//     }, []);
//     // State to hold the reports data
// // Empty dependency array means it runs only once on component mount

//     return (
//         <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//             <div className="h-[20%] w-full">
//                 <h1 className="text-[40px]">Reportes</h1>
//                 <div className="h-[50px] w-full flex justify-between items-center">
//                     <h1>Reportes sobre funcionamiento</h1>
//                 </div>
//             </div>
//             <div className="h-[70%] w-full overflow-y-auto">
//                 {reportes.length === 0 ? (
//                     <p>No reports available</p>
//                 ) : (
//                     reportes.map((reporte, index) => (
//                         <Report reporte={reporte} key={index}></Report>
//                     ))
//                 )}
//             </div>
//         </motion.div>
//     );
// }

// export default ReportesUsuarios;
