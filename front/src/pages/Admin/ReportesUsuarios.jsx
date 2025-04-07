import { useState, useEffect } from "react";
import { getReporte } from "../services/adminReport";  // Adjust the import path based on where your file is located
import Report from '../../components/Report';
import { motion } from 'framer-motion';

function ReportesUsuarios() {
    // State to hold the reports data
    const [reportes, setReportes] = useState([]);

    // Function to fetch reports
    const fetchReportes = async () => {
        try {
            // Example: Assume you have a list of report IDs you want to fetch
            const reportIds = [1, 2, 3]; // Example IDs
            const fetchedReportes = await Promise.all(reportIds.map(id => getReporte(id)));
            setReportes(fetchedReportes);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

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
