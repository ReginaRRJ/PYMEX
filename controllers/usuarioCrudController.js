import { createUsuario as createUsuarioService, getUsuario as getUsuarioService, updateUsuario as updateUsuarioService, deleteUsuario as deleteUsuarioService } from "../controllers/adminCrud.js";

//Crear usuario
export const createUsuario = async (usuario) => {
  try {
    const result = await createUsuarioService(usuario); 
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Obtener usuarios
export const getUsuario = async (id) => {
  try {
    const usuario = await getUsuarioService(id); 
    return usuario;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Actualizar usuarios
export const updateUsuario = async (id, usuario) => {
  try {
    const result = await updateUsuarioService(id, usuario); 
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

//Eliminar usuarios
export const deleteUsuario = async (id) => {
  try {
    const result = await deleteUsuarioService(id); 
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
