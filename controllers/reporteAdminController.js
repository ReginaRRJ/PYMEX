// Import necessary modules using ES Module syntax
import { getReporte as getReportService, updateReporte as updateReportService} from "../controllers/adminReport.js";

{/*export async function createReporte(reporte) {
  try {
    const result = await createReportService(reporte); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}*/}

export async function getReporte(id) {
  try {
    const reporte = await getReportService(id); // Calls the service for DB interaction
    return reporte;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updateReporte(id, reporte) {
  try {
    const result = await updateReportService(id, reporte); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

{/*export async function deleteReporte(id) {
  try {
    const result = await deleteReportService(id); // Calls the service for DB interaction
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}*/}
