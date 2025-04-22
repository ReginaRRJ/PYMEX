
import { useState } from "react"
import Header from "../../components/Header";

import React from "react";

import PermisosUsuarios from "./PermisosUsuarios";
import ReportesUsuarios from "./ReportesUsuarios";
import NavbarIcon from "../../components/NavbarIcon";
import Profile from "../../components/Profile";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { motion } from 'framer-motion'

let rol = "ADMINISTRADOR"

import userImg from '../../assets/users.png'
import reportImg from '../../assets/report.png'

function AdminMain() {
    const [activeScreenAdmin, setActiveScreenAdmin] = useState("permisosUsuarios");

    const [addUserModal, setAddUserModal] = useState(false);
    const [editUserModal, setEditUserModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        contraseña: '',
        role: '',
        sucursal: ''
    });





    const renderScreen = () => {
        switch (activeScreenAdmin) {
            case "permisosUsuarios": 
                return <PermisosUsuarios addUserModal={addUserModal} setAddUserModal={setAddUserModal}
                                        editUserModal={editUserModal} setEditUserModal={setEditUserModal}/>;
            case "reportesUsuarios":
                return <ReportesUsuarios />;
            default:
                return <h2>Screen not found</h2>;
        }
    };

    return (
        <>
            {addUserModal && (
                <AddUser onClose={() => setAddUserModal(false)}></AddUser>
            )}


            {editUserModal && (
                <EditUser onClose={() => setEditUserModal(false)}></EditUser>
            )}

            <div className="w-screen h-screen flex flex-col items-center">
                <Header rol={rol}></Header>
                <hr className="w-[95%]"/>
                <div className="w-full h-[90%] flex">
                    <div className="w-[25%] h-full">
                        <div className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
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
                    {renderScreen()}
                </div>
            </div>

        </>
    )


        <div>

            

        </div>
        {/*Maybe div is in wrong place...*/}
        </div>
    );

}

export default AdminMain;
