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
})

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

describe('PA03002. Notificaciones', () => {
  it('Notificacion Entrega_Estimada', () => {
    cy.loginProveedor()
    cy.get('#Navbar').contains('Notificaciones').click();
    cy.get('[data-testid="notificacionEntrega-container"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) {
        cy.log('Switch inicia apagado'); //CASO 1: Switch está apagado
        cy.get('[data-testid="10h"]').should('be.disabled');
        cy.get('[data-testid="15h"]').should('be.disabled');
        cy.get('[data-testid="20h"]').should('be.disabled');

        cy.get('[data-testid="switchNotificacionEntrega"]').click();
        cy.get('[data-testid="switchNotificacionEntrega"]').should('be.checked');

        cy.get('[data-testid="10h"]').should('not.be.disabled').click();
        cy.get('[data-testid="10h"]').should('have.class', 'Mui-selected');

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();

        cy.get('[data-testid="switchNotificacionEntrega"]').should('be.checked');
        cy.get('[data-testid="10h"]').should('have.class', 'Mui-selected');

      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionEntrega"]').click();
        cy.get('[data-testid="switchNotificacionEntrega"]').should('not.be.checked');

        cy.get('[data-testid="10h"]').should('be.disabled');
        cy.get('[data-testid="15h"]').should('be.disabled');
        cy.get('[data-testid="20h"]').should('be.disabled');

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();

        cy.get('[data-testid="switchNotificacionEntrega"]').should('not.be.checked');
        cy.get('[data-testid="10h"]').should('be.disabled');
      }
    });  
  });

  it('Notificacion Automatización', () => {
    cy.loginProveedor()
    cy.get('#Navbar').contains('Notificaciones').click();
    cy.get('[data-testid="notificacionAutomatizacion-container"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) {
        cy.log('Switch inicia apagado'); //CASO 1: Switch está apagado

        cy.get('[data-testid="switchNotificacionAutomatizacion"]').click();
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').should('be.checked');

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').should('be.checked');

      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').click();
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').should('not.be.checked');

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.get('[data-testid="switchNotificacionAutomatizacion"]').should('not.be.checked');
      
      }
    });  
  });
});
