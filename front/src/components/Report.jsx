import React from "react";
import ReportButton from "./ReportButton";

function Report({ reporte, index }) {
    const getImportancia = (urgencia) => {
        let importancia = '!'.repeat(urgencia);
        let color;

        switch (urgencia) {
            case 3:
                color = 'text-red-500';
                break;
            case 2:
                color = 'text-yellow-500';
                break;
            case 1:
                color = 'text-green-500';
                break;
            default:
                color = 'text-gray-500';
        }

        return { importancia, color };
    };

    const { importancia, color } = getImportancia(reporte.urgencia);

    return (
        <div className="w-full h-[180px] mb-[10px] bg-slate-100 rounded-2xl">
            <div className="w-full h-[50%] flex">
                <div className={`w-[20%] h-full ${color} flex justify-center items-center text-[30px] font-bold`}>
                    {importancia}
                </div>
                <div className="w-[30%] h-full">
                    <div className="w-full h-[50%] flex flex-col justify-end text-[18px] font-bold">Título:</div>
                    <div className="w-full h-[50%] text-[15px]">{reporte.titulo}</div>
                </div>
                <div className="w-[30%] h-full">
                    <div className="w-full h-[50%] flex flex-col justify-end text-[18px] font-bold">Fecha:</div>
                    <div className="w-full h-[50%] text-[15px]">{new Date(reporte.fechaReporte).toLocaleDateString()}</div>
                </div>
                <div className="w-[20%] h-full flex justify-center items-center">
                    <ReportButton reporte={reporte} />
                </div>
            </div>
            <div className="w-full h-[50%] pl-[3%] pr-[25px]">
                <div className="w-full h-[30%] flex flex-col justify-baseline text-[18px] font-bold pl-[10px]">
                    Contenido:
                </div>
                <div className="w-full h-[70%] flex flex-col justify-baseline text-[15px] pl-[10px]">
                    {reporte.descripcion}
                </div>
            </div>
        </div>
    );
}

export default Report;
