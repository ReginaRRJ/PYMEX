import market from '/assets/market-color.png';

function Sucursal({ sucursal, mode }) {
    return (
        <div className="w-[33%] h-full flex-shrink-0 flex flex-col items-center mr-5">
            <img src={market} alt="" className="w-[50%]"/>
            <h1 className="font-bold">{sucursal.ubicacion}</h1>
            <h1 className="text-[0.8rem] text-center">{sucursal.ubicacion_completa}</h1>
            <br />
            {mode === "unidades" ? (
                <h1>{sucursal.unidades} unidades</h1>
            ) : (
                <h1>${sucursal.ventas} MXN</h1>
            )}
        </div>
    )
}

export default Sucursal
