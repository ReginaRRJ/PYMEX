describe('PA03002. LeerPedidos', () => {
  it('Visualización de Pedidos ', () => {
    cy.loginProveedor()
    cy.get ('#pedido-list').find ('tr').should('have.length.greaterThan', 0)
  })
  it('Mensaje si no hay pedidos', () => {
    cy.loginProveedor();
    cy.intercept('GET', 'http://localhost:3001/api/pedidos/general', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
      });
    }).as('getPedidosVacios');
    cy.visit('http://localhost:5173/dist'); 
    cy.wait('@getPedidosVacios');
    cy.get('#pedido-list').should('contain', 'No se encontraron pedidos.');
  });
});

describe('PA03003. Detalles del Pedido', () => {
  it('UpdatePedidos Pendiente a Curso', () => {
    cy.loginProveedor();
    
    cy.get('#pedido-list').find('tr').contains('td', 'Pendiente').click();

    cy.contains('Detalles') 
      .parent()
      .within(() => {
        cy.contains('ID:')
          .next()
          .invoke('text')
          .as('pedidoId'); // Guardamos el ID como alias
      });

    cy.get('[data-testid="StepPendiente"]').should('have.class', '!bg-blue-500');
    cy.get('[data-testid="StepCurso"]').click();

    cy.get('@pedidoId').then((savedId) => {
      cy.request(`http://localhost:3001/api/pedidos/detalle/${savedId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.Estado).to.eq('En curso');
      });
    });
  });

  it('UpdatePedidos Curso a Pendiente', () => {
    cy.loginProveedor();
    
    cy.get('#pedido-list').find('tr').contains('td', 'En curso').click();

    cy.contains('Detalles') 
      .parent()
      .within(() => {
        cy.contains('ID:')
          .next()
          .invoke('text')
          .as('pedidoId'); 
      });

    cy.get('[data-testid="StepCurso"]').should('have.class', '!bg-blue-500');
    cy.get('[data-testid="StepPendiente"]').click();

    cy.get('@pedidoId').then((savedId) => {
      cy.request(`http://localhost:3001/api/pedidos/detalle/${savedId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.Estado).to.eq('Pendiente');
      });
    });
  });
});

describe('PA04003. Notificaciones', () => {
  beforeEach(() => {
  cy.loginProveedor();
  cy.intercept('PUT', '**/api/notificaciones/configuracion-notificaciones/**').as('updateConfig');
  cy.intercept('GET', '**/api/notificaciones/configuracion-notificaciones/**').as('getConfig');
  cy.get('#Navbar').contains('Notificaciones').click();
});

  it('Notificacion Entrega_Estimada', () => {
  cy.wait('@getConfig');

  cy.get('[data-testid="switchNotificacionEntrega"]').then(($switch) => {
    const isChecked = $switch.prop('checked');

    if (!isChecked) { //CASO 1: Switch está apagado
      cy.log('Switch inicia apagado');
      cy.get('[data-testid="switchNotificacionEntrega"]').click();

      cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
      cy.get('[data-testid="switchNotificacionEntrega"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);

      cy.reload();
      cy.get('#Navbar').contains('Notificaciones').click();
      cy.wait('@getConfig');

      cy.get('[data-testid="switchNotificacionEntrega"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);

    } else {
      cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
      cy.get('[data-testid="switchNotificacionEntrega"]').click();
      cy.wait('@updateConfig');

      cy.get('[data-testid="switchNotificacionEntrega"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);

      cy.reload();
      cy.get('#Navbar').contains('Notificaciones').click();
      cy.wait('@getConfig');

      cy.get('[data-testid="switchNotificacionEntrega"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);
    }
  });
});


  it('Notificacion Automatización', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchNotificacionAutomatizacion"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) {
        cy.log('Switch inicia apagado'); //CASO 1: Switch está apagado
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').click();

        cy.wait('@updateConfig')

        cy.get('[data-testid="switchNotificacionAutomatizacion"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);


        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionAutomatizacion"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);


      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchNotificacionAutomatizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionAutomatizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);
      }
    });  
  });

  it('Notificacion Estatus', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchNotificacionEstatus"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) {
        cy.log('Switch inicia apagado'); //CASO 1: Switch está apagado
        cy.get('[data-testid="switchNotificacionEstatus"]').click();

        cy.wait('@updateConfig')

        cy.get('[data-testid="switchNotificacionEstatus"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);


        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionEstatus"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);


      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionEstatus"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchNotificacionEstatus"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionEstatus"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);
      }
    });  
  });
});