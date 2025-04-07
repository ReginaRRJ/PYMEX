import sql from "mssql";
import config from "../dbConfig";  // Import your db config here

// Get Reporte by id
async function getReporte(id) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Reportes WHERE idReporte = @id');
        
        if (result.recordset.length === 0) {
            throw new Error('Report not found');
        }
        
        return result.recordset[0]; // Return the first (and presumably only) report
    } catch (error) {
        console.error('Error getting Reporte:', error);
        throw error; // Re-throw the error so it can be caught in the calling function
    }
}

// Update a Reporte
async function updateReporte(id, reporte) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('titulo', sql.NVarChar, reporte.titulo)
            .input('descripcion', sql.NVarChar, reporte.descripcion)
            .input('urgencia', sql.NVarChar, reporte.urgencia)
            .input('resuelto', sql.Bit, reporte.resuelto)
            .input('detallesResolucion', sql.NVarChar, reporte.detallesResolucion)
            .input('fechaReporte', sql.DateTime, reporte.fechaReporte)
            .input('fechaResolucion', sql.DateTime, reporte.fechaResolucion)
            .query('UPDATE Reportes SET titulo = @titulo, descripcion = @descripcion, urgencia = @urgencia, resuelto = @resuelto, detallesResolucion = @detallesResolucion, fechaReporte = @fechaReporte, fechaResolucion = @fechaResolucion WHERE idReporte = @id');
        return result;
    } catch (error) {
        console.error('Error updating Reporte:', error);
        throw error;
    }
}

// Export the functions using ES Module export
export { getReporte, updateReporte };
