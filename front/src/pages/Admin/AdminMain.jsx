
import { useState } from "react"
import { motion } from "framer-motion";
import Header from "../../components/Header";

import React from "react";

import PermisosUsuarios from "./PermisosUsuarios";
import ReportesUsuarios from "./ReportesUsuarios";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";

let rol = "ADMINISTRADOR"

import userImg from '../../assets/users.png'
import reportImg from '../../assets/report.png'

function AdminMain() {
    const [activeScreenAdmin, setActiveScreenAdmin] = useState("permisosUsuarios");



    const renderScreen = () => {
        switch (activeScreenAdmin) {
            case "permisosUsuarios": 
                return <PermisosUsuarios />;
            case "reportesUsuarios":
                return <ReportesUsuarios />;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (

        <div className="w-screen h-screen flex flex-col items-center">
            <Header rol={rol}></Header>
            <hr className="w-[95%]"/>
            <div className="w-full h-[90%] flex">
                <div className="w-[25%] h-full">
                    <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
                       {/* Botones de izquierda */}
                        <NavbarIcon icon={userImg} 
                                    text={"Usuarios"} 
                                    onClick={() => setActiveScreenAdmin("permisosUsuarios")} 
                                    selected={activeScreenAdmin === "permisosUsuarios"}>
                        </NavbarIcon>
                        <NavbarIcon icon={reportImg} 
                                    text={"Reportes"} 
                                    onClick={() => setActiveScreenAdmin("reportesUsuarios")} 
                                    selected={activeScreenAdmin === "reportesUsuarios"}>
                        </NavbarIcon>
                    </div>
                    <div className="w-full h-[20%]">
                        <Profile />
                    </div>
                </div>
                {renderScreen()}
            </div>

        <div>

            

        </div>
        {/*Maybe div is in wrong place...*/}
        </div>
    );
}

export default AdminMain;
