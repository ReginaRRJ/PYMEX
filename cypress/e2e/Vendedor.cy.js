describe('PA011002. Visualización de Ventas', () => {
  it('Lectura condicional de Ventas', () => {
    cy.loginVendedor();

    cy.get('#ventas-list').then(($tabla) => {
      const filas = $tabla.find('tr');
      
      if (filas.length > 1) {
        expect(filas.length).to.be.greaterThan(1);
      } else {
        cy.get('#ventas-list').should('contain', 'No se encontraron ventas.');
      }
    });
  });
});
