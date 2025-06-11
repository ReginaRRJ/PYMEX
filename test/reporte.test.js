import { describe, test, expect } from '@jest/globals';
import Reporte from '../Classes/ReportFollowUpClass.js'; // Ajusta la ruta si está en otro directorio

describe('Clase Reporte', () => {
  test('Debe crear una instancia con las propiedades correctas', () => {
    const idReporte= 1;
    const titulo = 'Error crítico';
    const descripcion = 'Falla al iniciar el sistema';
    const urgencia = 'Alta';
    const resuelto = false;
    const detallesResolucion= '';
    const fechaReporte= new Date('2023-10-10T10:00:00');
    const fechaResolucion= '';

    const reporte = new Reporte(idReporte, titulo, descripcion, urgencia, resuelto, detallesResolucion, fechaReporte, fechaResolucion);

    expect(reporte.idReporte).toBe(idReporte);
    expect(reporte.titulo).toBe(titulo);
    expect(reporte.descripcion).toBe(descripcion);
    expect(reporte.urgencia).toBe(urgencia);
    expect(reporte.resuelto).toBe(resuelto);
    expect(reporte.detallesResolucion).toBe(detallesResolucion);
    expect(reporte.fechaReporte).toBe(fechaReporte);
    expect(reporte.fechaResolucion).toBe(fechaResolucion);
  });
});