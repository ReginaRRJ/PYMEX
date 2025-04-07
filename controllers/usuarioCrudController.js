// Importing the necessary functions using ES Module syntax
import { createUsuario as createUsuarioService, getUsuario as getUsuarioService, updateUsuario as updateUsuarioService, deleteUsuario as deleteUsuarioService } from "../controllers/adminCrud.js";

// Function to create a user
export const createUsuario = async (usuario) => {
  try {
    const result = await createUsuarioService(usuario); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to get a user by id
export const getUsuario = async (id) => {
  try {
    const usuario = await getUsuarioService(id); // Calls the service for DB interaction
    return usuario;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to update a user by id
export const updateUsuario = async (id, usuario) => {
  try {
    const result = await updateUsuarioService(id, usuario); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Function to delete a user by id
export const deleteUsuario = async (id) => {
  try {
    const result = await deleteUsuarioService(id); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
