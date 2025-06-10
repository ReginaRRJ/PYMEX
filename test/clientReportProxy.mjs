export async function createReporteProxy(reporte) {
  const mssql = {
    connect: async () => ({
      request: () => ({
        input: () => ({
          input: () => ({
            input: () => ({
              input: () => ({
                input: () => ({
                  input: () => ({
                    input: () => ({
                      query: async () => ({ rowsAffected: [1] }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
    NVarChar: 'NVarChar',
    Bit: 'Bit',
    DateTime: 'DateTime',
  };

  const result = await mssql.connect().then(pool =>
    pool.request()
      .input('titulo', mssql.NVarChar, reporte.titulo)
      .input('descripcion', mssql.NVarChar, reporte.descripcion)
      .input('urgencia', mssql.NVarChar, reporte.urgencia)
      .input('resuelto', mssql.Bit, reporte.resuelto)
      .input('detallesResolucion', mssql.NVarChar, reporte.detallesResolucion)
      .input('fechaReporte', mssql.DateTime, reporte.fechaReporte)
      .input('fechaResolucion', mssql.DateTime, reporte.fechaResolucion)
      .query('INSERT INTO Reportes (...) VALUES (...)')
  );

  return result;
}