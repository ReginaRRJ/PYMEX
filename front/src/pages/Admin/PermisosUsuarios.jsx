import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";


function PermisosUsuarios({ addUserModal, setAddUserModal, editUserModal, setEditUserModal, setUsuarioSeleccionado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsuarios = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/usuarios", { signal: signal,
            headers: {
              "Authorization": `Bearer ${token}`
            }
});

        if (res.data && Array.isArray(res.data)) {
          setUsuarios(res.data);
          setError("");
        } else {
          setError("Formato de datos inesperado.");
          setUsuarios([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error obteniendo usuarios:", err);
          setError("No se pudo obtener la lista de usuarios. Verifica que el backend esté activo.");
          setUsuarios([]);
        }
      }
    };

    fetchUsuarios();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <motion.div
      className="h-full w-full flex flex-col pt-[6vh] pr-[50px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[20%] w-full">
        <h1 className="text-[40px]">Usuarios</h1>
        <div className="h-[50px] w-full flex justify-between items-center">
          <h1>Manejo de los perfiles de usuario</h1>  

          
          <button
            id="add-user-button"
            className="w-[18%] h-full bg-slate-900 rounded-2xl text-white"
            onClick={() => setAddUserModal(!addUserModal)}
          >
            + Agregar usuario
          </button>
        </div>
      </div>

      <div className="w-full h-[75%]">
        {error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <table className="table-fixed w-full h-full border-spacing-0">
          <thead className="block bg-slate-100 w-full">
              <tr className="w-full flex">
                  <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Nombre de Usuario</th>
                  <th className="w-1/3 px-4 py-2 text-left">Correo</th>
                  <th className="w-1/3 px-4 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg">Rol</th>
              </tr>
            </thead>
            <tbody 
           
            id = "usuarios-list"
            className="block w-full overflow-y-auto max-h-[55vh]">
              {usuarios.length > 0 ? (
                usuarios.map((user, index) => (
                  <tr
                    key={index}
                    className="flex w-full hover:bg-slate-300 cursor-pointer duration-300"
                    onClick={() => {setEditUserModal(!editUserModal); setUsuarioSeleccionado(user)}}
                  >
                    <td className="w-1/3 px-4 py-2">{user.nombreUsuario}</td>
                    <td className="w-1/3 px-4 py-2">{user.correo}</td>
                    <td className="w-1/3 px-4 py-2">{user.rol}</td>
                  </tr>
                ))
              ) : (
                <tr className="w-full flex">
                  <td colSpan="3" className="text-center w-full py-4 text-gray-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

export default PermisosUsuarios;

