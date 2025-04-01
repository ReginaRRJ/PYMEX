import React from "react";
import { useState } from "react";
import PermisosUsuarios from "./PermisosUsuarios";

function AdminMain() {
    const [activeScreenAdmin, setActiveScreenAdmin] = useState("permisosUsuarios");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        window.location.href = "/"; // Redirect to login page
    };

    const renderScreen = () => {
        switch (activeScreenAdmin) {
            case "permisosUsuarios":
                return <PermisosUsuarios />;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Cerrar sesión
            </button>
            {renderScreen()}
        </div>
    );
}

export default AdminMain;
