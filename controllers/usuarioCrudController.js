const { createUsuario, getUsuario, updateUsuario, deleteUsuario } = require("../controllers/adminCrud");

async function createUsuario(usuario) {
  try {
    const result = await createUsuario(usuario); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUsuario(id) {
  try {
    const usuario = await getUsuario(id); // Calls the service for DB interaction
    return usuario;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateUsuario(id, usuario) {
  try {
    const result = await updateUsuario(id, usuario); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteUsuario(id) {
  try {
    const result = await deleteUsuario(id); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { createUsuario, getUsuario, updateUsuario, deleteUsuario };
