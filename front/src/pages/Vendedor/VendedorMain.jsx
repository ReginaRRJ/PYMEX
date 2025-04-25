import { useState } from "react"
import RegistroVenta from "./RegistroVenta";

function VendedorMain() {
    const [activeScreenVendedor, setActiveScreenVendedor] = useState("registroVenta");

    const renderScreen = () => {
        switch (activeScreenVendedor) {
            case "registroVenta":
                return <RegistroVenta />;
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

export default VendedorMain
