import { useState, useEffect } from "react";
<<<<<<< HEAD
import { getReporte } from "../../../../controllers/adminReport";  // Adjust the import path based on where your file is located
=======
//import { getReporte } from "../../../../controllers/adminReport";  // Adjust the import path based on where your file is located
>>>>>>> 099e93624c527696b6ba26f0e6621b2b3e1c3601
import Report from '../../components/Report';
import { motion } from 'framer-motion';
import process from 'process';


function ReportesUsuarios() {
    // State to hold the reports data
    const [reportes, setReportes] = useState([]);
    const fetchReportes = async () => {
        try {
          const reportIds = [1, 2, 3]; // o ids dinámicos si los tienes
      
          const fetchedReportes = await Promise.all(
            reportIds.map(id =>
              fetch("http://localhost:3001/reportes").then(res => res.json())
            )
          );
      
          setReportes(fetchedReportes);
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      };
    // // Function to fetch reports
    // const fetchReportes = async () => {
    //     try {
    //         // Example: Assume you have a list of report IDs you want to fetch
    //         const reportIds = [1, 2, 3]; // Example IDs
    //         const fetchedReportes = await Promise.all(reportIds.map(id => getReporte(id)));
    //         setReportes(fetchedReportes);
    //     } catch (error) {
    //         console.error("Error fetching reports:", error);
    //     }
    // };

    useEffect(() => {
        fetchReportes();
    }, []); // Empty dependency array means it runs only once on component mount

    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="h-[20%] w-full">
                <h1 className="text-[40px]">Reportes</h1>
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Reportes sobre funcionamiento</h1>
                </div>
            </div>
            <div className="h-[70%] w-full overflow-y-auto">
                {reportes.length === 0 ? (
                    <p>No reports available</p>
                ) : (
                    reportes.map((reporte, index) => (
                        <Report reporte={reporte} key={index}></Report>
                    ))
                )}
            </div>
        </motion.div>
    );
}

export default ReportesUsuarios;
