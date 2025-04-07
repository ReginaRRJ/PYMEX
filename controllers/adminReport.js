const Reporte = require("../Classes/ReportFollowUpClass"); 


const sql = require('mssql');


// async function createReporte(reporte) {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request()
//             .input('titulo', sql.NVarChar, reporte.titulo)
//             .input('descripcion', sql.NVarChar, reporte.descripcion)
//             .input('urgencia', sql.NVarChar, reporte.urgencia)
//             .input('resuelto', sql.Bit, reporte.resuelto)
//             .input('detallesResolucion', sql.NVarChar, reporte.detallesResolucion)
//             .input('fechaReporte', sql.DateTime, reporte.fechaReporte)
//             .input('fechaResolucion', sql.DateTime, reporte.fechaResolucion)
//             .query('INSERT INTO Reportes (titulo, descripcion, urgencia, resuelto, detallesResolucion, fechaReporte, fechaResolucion) VALUES (@titulo, @descripcion, @urgencia, @resuelto, @detallesResolucion, @fechaReporte, @fechaResolucion)');
//         return result;
//     } catch (error) {
//         console.error('Error creating Reporte:', error);
//     }
// }

// Get Reporte by id
async function getReporte(id) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Reportes WHERE idReporte = @id');
        return result.recordset[0]; // Return the first (and presumably only) report
    } catch (error) {
        console.error('Error getting Reporte:', error);
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
    }
}

// // Delete a Reporte
// async function deleteReporte(id) {
//     try {
//         const pool = await sql.connect(config);
//         const result = await pool.request()
//             .input('id', sql.Int, id)
//             .query('DELETE FROM Reportes WHERE idReporte = @id');
//         return result;
//     } catch (error) {
//         console.error('Error deleting Reporte:', error);
//     }
// }

module.exports = {getReporte, updateReporte};
