/*
describe('PA02001. Visualización de Pedidos', () => {
  it('Lectura de Pedidos ', () => {
    cy.loginDueño()
    cy.get ('#pedido-list').find ('tr').should('have.length.greaterThan', 0)
  })
    it('Mensaje si no hay pedidos', () => {
    cy.loginDueño()

    // Interceptamos la solicitud GET para la ruta de nancyDueño con id=1
    cy.intercept('GET', 'http://localhost:3001/api/pedidosClient/1', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
      });
    }).as('getPedidosVacios');

    cy.wait('@getPedidosVacios');
    cy.get('#pedido-list').should('contain', 'No se encontraron pedidos.');
  });
});

*/

describe('PA08001. Realización de un Reporte', () => {
  it('Realización de Reporte ', () => {
    cy.loginDueño()
    cy.get('#Navbar').contains('Reportar').click();

    cy.get('[data-testid="input-titulo"]').type('Fallas de Sistema');

    const prioridad = Math.floor(Math.random() * 3) + 1;
    cy.log(`Prioridad seleccionada: ${prioridad}`);
    cy.get(`[data-testid="prioridad-${prioridad}"]`).click();

    cy.get('[data-testid="input-descripcion"]').type(
        'No fue posible realizar actualizaciones de los estados de los pedidos.');
    cy.get('[data-testid="btn-enviar-reporte"]').click();

    cy.loginAdmin();
    cy.intercept('GET', '**/reportes').as('getReportes');
    cy.get('#Navbar').contains('Reportes').click();

    cy.wait('@getReportes').then((interception) => {
        const reportes = interception.response.body;

        // Busca el reporte con los datos que creaste
        const reporte = reportes.find((r) => 
            r.titulo === 'Fallas de Sistema' &&
            r.descripcion === 'No fue posible realizar actualizaciones de los estados de los pedidos.'
        );
        console.log('Reporte completo:', reporte);
        console.log('Tipo de resuelto:', typeof reporte.resuelto);
        console.log('Valor de resuelto:', reporte.resuelto);

        expect(reporte).to.exist;
        expect(reporte.urgencia).to.be.oneOf([1, 2, 3]);
        });
  })
});


describe('PA04002. Notificaciones', () => {
   beforeEach(() => {
  cy.loginDueño();
  cy.intercept('PUT', '**/api/notificaciones/configuracion-notificaciones/**').as('updateConfig');
  cy.intercept('GET', '**/api/notificaciones/configuracion-notificaciones/**').as('getConfig');
  cy.get('#Navbar').contains('Notificaciones').click();
});

  it('Notificación Anticipación de pedidos a distribuidor', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchAnticipación"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchAnticipación"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
        cy.get('[data-testid="switchAnticipación"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchAnticipación"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchAnticipación"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchAnticipación"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchAnticipación"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);
      }
    });
  });
  
  it('Notificación Automatización de pedidos', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchAutomatización"]').then(($switch) => {
    const isChecked = $switch.prop('checked');

    if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchAutomatización"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
        cy.get('[data-testid="switchAutomatización"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchAutomatización"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);
    
    } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchAutomatización"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchAutomatización"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchAutomatización"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);
        }
    });
});

    it('Notificación Estatus de Pedidos', () => {
        cy.wait('@getConfig');

        cy.get('[data-testid="switchEstatus"]').then(($switch) => {
        const isChecked = $switch.prop('checked');

        if (!isChecked) { //CASO 1: Switch está apagado
            cy.log('Switch inicia apagado');
            cy.get('[data-testid="switchEstatus"]').click();

            cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
            cy.get('[data-testid="switchEstatus"]', { timeout: 8000 })
            .should('have.prop', 'checked', true);

            cy.reload();
            cy.get('#Navbar').contains('Notificaciones').click();
            cy.wait('@getConfig');

            cy.get('[data-testid="switchEstatus"]', { timeout: 8000 })
            .should('have.prop', 'checked', true);

        } else {
            cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
            cy.get('[data-testid="switchEstatus"]').click();
            cy.wait('@updateConfig');

            cy.get('[data-testid="switchEstatus"]', { timeout: 8000 })
            .should('have.prop', 'checked', false);

            cy.reload();
            cy.get('#Navbar').contains('Notificaciones').click();
            cy.wait('@getConfig');

            cy.get('[data-testid="switchEstatus"]', { timeout: 8000 })
            .should('have.prop', 'checked', false);
        }
    });
 });

 it('Notificación Solicitudes de autorización', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchSolicitudes"]').then(($switch) => {
    const isChecked = $switch.prop('checked');

    if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchSolicitudes"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
        cy.get('[data-testid="switchSolicitudes"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchSolicitudes"]', { timeout: 8000 })
        .should('have.prop', 'checked', true);
    
    } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchSolicitudes"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchSolicitudes"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchSolicitudes"]', { timeout: 8000 })
        .should('have.prop', 'checked', false);
        }
    });
});
});