describe('PA03004. LeerPedidos', () => {
  it('Visualización de Pedidos ', () => {
    cy.loginSucursal()
    cy.get ('#pedido-list').find ('tr').should('have.length.greaterThan', 0)
  })
    it('Mensaje si no hay pedidos', () => {
    cy.loginSucursal();

    // Interceptamos la solicitud GET para la ruta de pedidosXimena con id=55
    cy.intercept('GET', 'http://localhost:3001/api/sucursal/usuario/55', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
      });
    }).as('getPedidosVacios');
    cy.visit('http://localhost:5173/sucursal'); 
    cy.wait('@getPedidosVacios');
    cy.get('#pedido-list').should('contain', 'No se encontraron pedidos.');
  });
});


describe('PA04004. Notificaciones', () => {
  it('Pedido Autorizado', () => {
    cy.loginSucursal();

    // 🟢 Interceptar ANTES de cualquier navegación o acción que dispare la petición
    cy.intercept('GET', '**/api/notificaciones/configuracion-notificaciones/**').as('getNotificaciones');


    // 🔽 Ir a la sección de Notificaciones
    cy.get('#Navbar').contains('Notificaciones').click();

    // 🕓 Esperar a que la respuesta llegue
    cy.wait('@getNotificaciones').then(({ response }) => {
      const notificaciones = response.body;

      // ✅ Validar que sea un arreglo
      if (!Array.isArray(notificaciones)) {
        throw new Error('La respuesta no es un arreglo: ' + JSON.stringify(notificaciones));
      }

      // 🟢 Buscar notificación específica
      const pedidoAutorizado = notificaciones.find(n => n.idNotificacion === 1);

      if (!pedidoAutorizado) {
        throw new Error('No se encontró idNotificacion: 1');
      }

      // 🧪 Verificar estado actual
      cy.log('Estado inicial desde API:', pedidoAutorizado.activo);

      // 🧩 Validar que el switch refleja ese estado
      cy.get('[data-testid="switchNotificacionAutorizado"]').should(`${pedidoAutorizado.activo ? '' : 'not.'}be.checked`);

      // 🛠️ Si está apagado, activarlo
      if (!pedidoAutorizado.activo) {
        cy.get('[data-testid="switchNotificacionAutorizado"]').click();
        cy.get('[data-testid="switchNotificacionAutorizado"]').should('be.checked');
      }
    });
  });
});
