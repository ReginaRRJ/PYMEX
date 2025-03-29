import { useState } from "react"
import PedidosProveedor from "./PedidosProveedor";

function SucursalMain() {
    const [activeScreenSucursal, setActiveScreenSucursal] = useState("pedidosProv");

    const renderScreen = () => {
        switch (activeScreenSucursal) {
            case "pedidosProv":
                return <PedidosProveedor />;
            default:
                return <h2>Screen not found</h2>;
        }
    }

    return (
        <div>
            {renderScreen()}
        </div>
    )
}

export default SucursalMain
