// test/clientReport.test.mjs
import { createReporteProxy } from './clientReportProxy.mjs';

class Reporte {
  constructor(idReporte, titulo, descripcion, urgencia, resuelto, detallesResolucion, fechaReporte, fechaResolucion) {
    this.idReporte = idReporte;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.urgencia = urgencia;
    this.resuelto = resuelto;
    this.detallesResolucion = detallesResolucion;
    this.fechaReporte = fechaReporte;
    this.fechaResolucion = fechaResolucion;
  }
}

describe('createReporte', () => {
  it('debe crear un reporte sin errores', async () => {
    const nuevoReporte = new Reporte(
      1,
      'Título Test',
      'Descripción de prueba',
      'Alta',
      false,
      '',
      new Date(),
      null
    );

    const resultado = await createReporteProxy(nuevoReporte);
    expect(resultado).toBeDefined();
    expect(resultado.rowsAffected).toContain(1);
  });
});