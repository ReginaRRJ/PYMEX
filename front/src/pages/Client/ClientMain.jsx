import { useState } from "react"
import PedidosDist from "./PedidosDist"

function ClientMain() {
    const [activeScreenClient, setActiveScreenClient] = useState("pedidosDist");

    const renderScreen = () => {
        switch (activeScreenClient) {
            case "pedidosDist":
                return <PedidosDist />;
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

export default ClientMain
