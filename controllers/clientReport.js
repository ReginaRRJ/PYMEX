const Reporte = require("../Classes/ReportFollowUpClass"); 


const sql = require('mssql');


async function createReporte(reporte) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('titulo', sql.NVarChar, reporte.titulo)
            .input('descripcion', sql.NVarChar, reporte.descripcion)
            .input('urgencia', sql.NVarChar, reporte.urgencia)
            .input('resuelto', sql.Bit, reporte.resuelto)
            .input('detallesResolucion', sql.NVarChar, reporte.detallesResolucion)
            .input('fechaReporte', sql.DateTime, reporte.fechaReporte)
            .input('fechaResolucion', sql.DateTime, reporte.fechaResolucion)
            .query('INSERT INTO Reportes (titulo, descripcion, urgencia, resuelto, detallesResolucion, fechaReporte, fechaResolucion) VALUES (@titulo, @descripcion, @urgencia, @resuelto, @detallesResolucion, @fechaReporte, @fechaResolucion)');
        return result;
    } catch (error) {
        console.error('Error creating Reporte:', error);
    }
}