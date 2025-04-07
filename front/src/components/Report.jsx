import ReportButton from "./ReportButton";

function Report({reporte, index}) {

    const getImportancia = (urgencia) => {
        let importancia = '!'.repeat(urgencia);
        let color;

        // Set color based on urgency level
        switch (urgencia) {
            case 3:
                color = 'text-red-500';  // Red for priority 3
                break;
            case 2:
                color = 'text-yellow-500';  // Yellow for priority 2
                break;
            case 1:
                color = 'text-green-500';  // Green for priority 1
                break;
            default:
                color = 'text-gray-500';  // Default gray if no valid urgency
        }

        return { importancia, color };
    };

    const { importancia, color } = getImportancia(reporte.urgencia);

    return (
        <div className="w-full h-[180px] mb-[10px] bg-slate-100 rounded-2xl">
            <div className="w-full h-[50%] flex">
                <div className={`w-[20%] h-full ${color} flex justify-center items-center text-[30px] font-bold`}>{importancia}</div>
                <div className="w-[30%] h-full">
                    <div className="w-full h-[50%] flex flex-col justify-end text-[16px] font-bold">Titulo:</div>
                    <div className="w-full h-[50%] text-[12px]">{reporte.titulo}</div>
                </div>
                <div className="w-[30%] h-full">
                    <div className="w-full h-[50%] flex flex-col justify-end text-[16px] font-bold">Fecha:</div>
                    <div className="w-full h-[50%] text-[12px] ">{reporte.fechaReporte}</div>
                </div>
                <div className="w-[20%] h-full flex justify-center items-center">
                    <ReportButton reporte={reporte}></ReportButton>
                </div>
            </div>
            <div className="w-full h-[50%] pl-[3%] pr-[25px]">
                <div className="w-ful h-[30%] flex flex-col justify-baseline text-[16px] font-bold pl-[10px]">Contenido:</div>
                <div className="w-full h-[70%] flex flex-col justify-baseline text-[12px] pl-[10px]">{reporte.descripcion}</div>
            </div>
        </div>
    )
}

export default Report
