
import usuarios from '../Admin/usuarios'
import { motion } from 'framer-motion'


import React from "react";

function PermisosUsuarios() {
    return (
        <motion.div className="h-full w-[75%] flex flex-col pt-[6vh] pr-[50px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}> 
            <div className='h-[20%] w-full'>
                <h1 className="text-[40px]">Usuarios</h1> 
                <div className="h-[50px] w-full flex justify-between items-center">
                    <h1>Manejo de los perfiles de usuario</h1>  
                    <button className="w-[18%] h-full bg-slate-900 rounded-2xl text-white">+ Agregar usuario</button>
                </div>
            </div>

            <div className="w-full h-[75%]">
                <table className="table-fixed w-full h-full border-spacing-0">
                    <thead className="block bg-slate-100 w-full">
                        <tr className="w-full flex">
                            <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Nombre de Usuario</th>
                            <th className="w-1/3 px-4 py-2 text-left">Correo</th>
                            <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Rol</th>
                        </tr>
                    </thead>
                    <tbody className="block w-full overflow-y-auto max-h-[55vh]">
                    {usuarios.map((user, index) => (
                        <tr key={index} className="flex w-full">
                        <td className="w-1/3 px-4 py-2">{user.nombreUsuario}</td>
                        <td className="w-1/3 px-4 py-2">{user.correo}</td>
                        <td className="w-1/3 px-4 py-2">{user.rol}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default PermisosUsuarios
