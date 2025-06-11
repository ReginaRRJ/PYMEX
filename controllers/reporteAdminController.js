import {getReporte as getReportService,updateReporte as updateReportService,createReporte as createReportService,} from "../controllers/adminReport.js";

//Crear reporte
export async function createReporte(reporte) {
  try {
    const result = await createReportService(reporte); 
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

//Obtener reportes
export async function getReporte(id) {
  try {
    const reporte = await getReportService(id); 
    return reporte;
  } catch (err) {
    throw new Error(err.message);
  }
}

//Actualizar reportes
export async function updateReporte(id, reporte) {
  try {
    const result = await updateReportService(id, reporte); 
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}