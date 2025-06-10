//Admin
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

function AdminMain({ 
  initialScreen = "permisosUsuarios", 
  showAddUserModal = false, 
  showEditUserModal = false, 
  initialUser = null 
}) {
    const [activeScreenAdmin, setActiveScreenAdmin] = useState(initialScreen);
    const [addUserModal, setAddUserModal] = useState(showAddUserModal); 
    const [editUserModal, setEditUserModal] = useState(showEditUserModal);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(initialUser);
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
                                        editUserModal={editUserModal} setEditUserModal={setEditUserModal} 
                                        setUsuarioSeleccionado={setUsuarioSeleccionado}/>;
            case "reportesUsuarios":
                return <ReportesUsuarios />;
            default:
                return <h2>Pantalla no encontrada</h2>;
        }
    };

    return (
        <>
            {addUserModal && (
                <AddUser onClose={() => setAddUserModal(false)}></AddUser>
            )}

            {editUserModal && (
                <EditUser user={usuarioSeleccionado} onClose={() => {
                    setEditUserModal(false);
                    setUsuarioSeleccionado(null);
                  }}></EditUser>
            )}

<div className="w-screen h-screen flex flex-col items-center">
            <Header rol={rol}></Header>
            <hr className="w-[95%]"/>
            <div className="w-full h-[90%] flex">
                <div className="w-[25%] h-full">

                   
                    <div id="Navbar" className="w-full h-[80%] flex flex-col items-center pt-[8vh]">
                      
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
                    <div className="w-[75%] h-full">
                        {renderScreen()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminMain;

