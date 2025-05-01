import { motion, AnimatePresence } from 'framer-motion'
import roles from './roles';
import { useState } from 'react';
import axios from 'axios';

async function generarHash(contrasena) {
    const encoder = new TextEncoder();
    const data = encoder.encode(contrasena);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function AddUser({onClose}) {
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [apellido, setApellido] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [idPyme, setIdPyme] = useState("1");
    const [selectedRole, setSelectedRole] = useState('Admin');

    // Handle change event to update the selected role
    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const crearUsuario = async () => {
        try {
            const hash = await generarHash(contraseña);
            const datos = {
                nombreUsuario: nombre,
                correo,
                apellidoUsuario: apellido,
                contrasena: contraseña, // solo si la manejas
                hashContrasena: hash,
                rol: selectedRole,
                idPyme: idPyme
            };
            if (selectedRole === "Sucursal") {
                datos.sucursal = sucursal;
            }
        
            const res = await axios.post(`http://localhost:3001/api/usuarios/admin`, datos);
            console.log("Usuario creado:", res.data);
            onClose(); // cerrar modal si todo sale bien
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}
            initial={{ opacity: 0}}
            animate={{opacity: 1}}
            transition={{ duration: 0.2 }}>
                <motion.div className="bg-white rounded-xl w-[50%] h-[70%]" onClick={handleContentClick}
                initial={{ opacity: 0, scale: 0.3}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, size: 0}}
                transition={{ duration: 0.2 }}>
                    <div className='h-[5%] w-full bg-white rounded-2xl flex justify-end pr-5 pt-3'>
                        <h1 className='cursor-pointer text-[20px]' onClick={onClose}>x</h1>
                    </div>
                    <div className='h-[15%] w-full flex justify-center items-center text-[2rem]'>Crear nuevo usuario</div>
                    <div className='h-[60%] w-full flex'>
                        <div className='h-full w-[50%] flex flex-col justify-between pl-14 pr-5 pt-3 pb-5'>
                            <div className='h-20%'>
                                <h1>Nombre</h1>
                                <input type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={nombre}
  onChange={(e) => setNombre(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Correo</h1>
                                <input type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={correo}
  onChange={(e) => setCorreo(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Rol</h1>
                                <select className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" 
                                value={selectedRole} // Binding the state to the select value
                                onChange={handleChange}> // Update state when selection changes
                                    {roles.map((role, index) => (
                                        <option key={index} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalizing the first letter */}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='h-full w-[50%] flex flex-col justify-between pl-5 pr-14 pt-3 pb-5'>
                            <div className='h-20%'>
                                <h1>Apellido</h1>
                                <input type="text" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={apellido}
  onChange={(e) => setApellido(e.target.value)}/>
                            </div>
                            <div className='h-20%'>
                                <h1>Contraseña</h1>
                                <input type="password" className="w-full h-[3rem] rounded-xl pl-2 bg-slate-200" value={contraseña}
  onChange={(e) => setContraseña(e.target.value)}/>
                            </div>
                            <div className='h-20% relative'>
                                <h1 className={`${selectedRole === "Sucursal" ? "" : "text-gray-300"}`}>Sucursal</h1>
                                <select type="text" value={sucursal}
  onChange={(e) => setSucursal(e.target.value)} className={`w-full h-[3rem] rounded-xl pl-2 ${selectedRole === "Sucursal" ? "bg-slate-200" : "bg-slate-400 cursor-not-allowed"}`} disabled={selectedRole !== "Sucursal"}/>
                            </div>
                        </div>
                    </div>
                    <div className='h-[15%] w-full flex justify-center items-center'>
                        <button className='h-[40px] w-[100px] rounded-2xl text-white bg-black hover:bg' onClick={crearUsuario} >Crear</button>
                    </div>
                
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AddUser
