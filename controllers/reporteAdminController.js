const { createReporte, getReporte, updateReporte, deleteReporte } = require("../controllers/adminReport");

async function createReporte(reporte) {
  try {
    const result = await createReporte(reporte); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getReporte(id) {
  try {
    const reporte = await getReporte(id); // Calls the service for DB interaction
    return reporte;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateReporte(id, reporte) {
  try {
    const result = await updateReporte(id, reporte); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteReporte(id) {
  try {
    const result = await deleteReporte(id); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { createReporte, getReporte, updateReporte, deleteReporte };
