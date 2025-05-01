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
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
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
                                        //usuarioSeleccionado={usuarioSeleccionado} 
                                        setUsuarioSeleccionado={setUsuarioSeleccionado}/>;
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
                    <div className="w-[75%] h-full">
                        {renderScreen()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminMain;

// import usuarios from '../Admin/usuarios'
// import { motion } from 'framer-motion'
// import { useState } from "react"

// function PermisosUsuarios({addUserModal, setAddUserModal, editUserModal, setEditUserModal}) {

//     return (
//         <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
//             <div className='h-[20%] w-full'>
//                 <h1 className="text-[40px]">Usuarios</h1> 
//                 <div className="h-[50px] w-full flex justify-between items-center">
//                     <h1>Manejo de los perfiles de usuario</h1>  
//                     <button className="w-[18%] h-full bg-slate-900 rounded-2xl text-white" 
//                     onClick={() => (setAddUserModal(!addUserModal))}>+ Agregar usuario</button>
//                 </div>
//             </div>

//             <div className="w-full h-[75%]">
//                 <table className="table-fixed w-full h-full border-spacing-0">
//                     <thead className="block bg-slate-100 w-full">
//                         <tr className="w-full flex">
//                             <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Nombre de Usuario</th>
//                             <th className="w-1/3 px-4 py-2 text-left">Correo</th>
//                             <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Rol</th>
//                         </tr>
//                     </thead>
//                     <tbody className="block w-full overflow-y-auto max-h-[55vh]">
//                     {usuarios.map((user, index) => (
//                         <tr key={index} className="flex w-full rounded-md hover:bg-slate-300 hover:cursor-pointer duration-300" onClick={() => setEditUserModal(!editUserModal)}>
//                             <td className="w-1/3 px-4 py-2">{user.nombreUsuario}</td>
//                             <td className="w-1/3 px-4 py-2">{user.correo}</td>
//                             <td className="w-1/3 px-4 py-2">{user.rol}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </motion.div>
//     )
// }

// export default PermisosUsuarios
