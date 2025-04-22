import Report from '../../components/Report'
import reportes from './reportes'
import { motion } from 'framer-motion'

function ReportesUsuarios() {
    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className="h-[20%] w-full">
                <h1 className="text-[40px]">Reportes</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Reportes sobre funcionamiento</h1>
                </div>
            </div>
            <div className="h-[70%] w-full overflow-y-auto">
                {reportes
                .sort((a, b) => a.resuelto - b.resuelto) // Primero "resuelto = false"
                .map((reporte, index) => (
                    <Report reporte={reporte} key={index}></Report>
                ))}
            </div>
        </motion.div>
    )
}

export default ReportesUsuarios
