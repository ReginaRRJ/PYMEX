import { useState } from 'react'
import checkmark from '../assets/checkmark.png'

function ReportButton({ reporte }) {
    const [isSelected, setIsSelected] = useState(reporte.resuelto === true); // Variable que ayuda a mantener el control de resuelto/no resuelto

     {/* ID para Pruebas */}
    return (
        <button 
            data-testid="UpdateEstadoReport-button"
            className={`relative group w-[70%] h-[50%] ${isSelected ? 'bg-slate-100' : 'bg-black'} 
            rounded-2xl font-sans text-white text-center overflow-hidden hover:bg-slate-100 duration-500`}
            onClick={() => !isSelected && setIsSelected(true)}
            >
            {/* Por resolver text */}
            {!isSelected && (
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:-top-[200%]">
                    {isSelected ? null : <h1 className="text-white">Por resolver</h1>}
                </div>
            )}

            {/* Checkmark */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 
                ${isSelected ? 'top-0' : 'top-[200%] group-hover:top-0'}`}>
                <img src={checkmark} alt="" className={`$ w-[20%]`} />
            </div>
        </button>
    );
}

export default ReportButton;
