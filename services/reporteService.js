// services/reporteService.js
export function makeReporteService({ createReportService, getReportService, updateReportService }) {
  return {
    async createReporte(reporte) {
      try {
        return await createReportService(reporte);
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async getReporte(id) {
      try {
        return await getReportService(id);
      } catch (err) {
        throw new Error(err.message);
      }
    },
    async updateReporte(id, reporte) {
      try {
        return await updateReportService(id, reporte);
      } catch (err) {
        throw new Error(err.message);
      }
    },
  };
}