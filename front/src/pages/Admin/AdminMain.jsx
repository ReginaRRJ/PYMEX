import { useState } from "react"
import PermisosUsuarios from "./PermisosUsuarios";

function AdminMain() {
    const [activeScreenAdmin, setActiveScreenAdmin] = useState("permisosUsuarios");

    const renderScreen = () => {
        switch (activeScreenAdmin) {
            case "permisosUsuarios":
                return <PermisosUsuarios />;
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

export default AdminMain
