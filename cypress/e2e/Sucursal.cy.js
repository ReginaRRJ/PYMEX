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

describe('PA02002. Creación de Pedidos', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/sucursal/proveedores').as('getProveedores');
    cy.intercept('GET', '**/api/sucursal/productos/*').as('getProductos');
  });

  it('Pedido Nuevo', () => {
    cy.loginSucursal();


    cy.get("#add-pedido-button").click();

    cy.wait('@getProveedores');
    cy.get('[data-testid="select-proveedor"]').select('Proveedor Uno');

    const randomNumber = Math.floor(Math.random() * 29) + 2;
    cy.wrap(randomNumber).as('cantidadSeleccionada'); // guardamos alias
    cy.get('[data-testid="input-piezas"]').type(randomNumber.toString());
    cy.get('[data-testid="select-TipoPedido"]').select('Electrónica');

    cy.wait('@getProductos');

    cy.get('[data-testid="select-producto"] option').then($options => {
      const validOptions = [...$options].filter(opt => opt.value);
      const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
      const productText = randomOption.text.trim();
      cy.wrap(productText).as('productoSeleccionado'); // guardamos alias
      cy.get('[data-testid="select-producto"]').select(randomOption.value);
    });

    cy.get('[data-testid="input-telefono"]').type('0123456789');
    cy.get('[data-testid="input-correo"]').type('Tecno@Distribuciones.com');
    cy.get('#crearPedido_button').click();

    cy.reload();

    // Accedemos a los alias guardados
    cy.get('@productoSeleccionado').then(producto => {
      cy.get('@cantidadSeleccionada').then(cantidad => {
        cy.get('#pedido-list')
          .contains('tr', producto)
          //.should('contain', cantidad);
      });
    });
  });
})

describe('PA08002. Realización de un Reporte', () => {
  it('Realización de Reporte ', () => {
    cy.loginSucursal()
    cy.get('#Navbar').contains('Reportar').click();

    cy.get('[data-testid="input-titulo"]').type('Error al generar pedidos');

    const prioridad = Math.floor(Math.random() * 3) + 1;
    cy.log(`Prioridad seleccionada: ${prioridad}`);
    cy.get(`[data-testid="prioridad-${prioridad}"]`).click();

    cy.get('[data-testid="input-descripcion"]').type(
        'El sistema se congela después de realizar múltiples operaciones.');
    cy.get('[data-testid="btn-enviar-reporte"]').click();

    cy.loginAdmin();
    cy.intercept('GET', '**/reportes').as('getReportes');
    cy.get('#Navbar').contains('Reportes').click();

    cy.wait('@getReportes').then((interception) => {
        const reportes = interception.response.body;

        // Busca el reporte con los datos que creaste
        const reporte = reportes.find((r) => 
            r.titulo === 'Error al generar pedidos' &&
            r.descripcion === 'El sistema se congela después de realizar múltiples operaciones.'
        );
        console.log('Reporte completo:', reporte);
        console.log('Tipo de resuelto:', typeof reporte.resuelto);
        console.log('Valor de resuelto:', reporte.resuelto);

        expect(reporte).to.exist;
        expect(reporte.urgencia).to.be.oneOf([1, 2, 3]);
        });

  })
});

describe('PA04004. Notificaciones', () => {
   beforeEach(() => {
  cy.loginSucursal();
  cy.intercept('PUT', '**/api/notificaciones/configuracion-notificaciones/**').as('updateConfig');
  cy.intercept('GET', '**/api/notificaciones/configuracion-notificaciones/**').as('getConfig');
  cy.get('#Navbar').contains('Notificaciones').click();
});

  it('Notificación Pedido Autorizado', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchNotificacionPedidoAutorizado"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionPedidoAutorizado"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);
      }
    });
  });

it('Notificación Automatización de Pedidos', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchNotificacionAutorizacion"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchNotificacionAutorizacion"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
        cy.get('[data-testid="switchNotificacionAutorizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionAutorizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', true);

      } else {
        cy.log('Switch inicia encendido'); //CASO 2: Switch está encendido
        cy.get('[data-testid="switchNotificacionAutorizacion"]').click();
        cy.wait('@updateConfig');

        cy.get('[data-testid="switchNotificacionAutorizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);

        cy.reload();
        cy.get('#Navbar').contains('Notificaciones').click();
        cy.wait('@getConfig');

        cy.get('[data-testid="switchNotificacionAutorizacion"]', { timeout: 8000 })
          .should('have.prop', 'checked', false);
      }
    });
  });

  it('Notificación Estatus de Pedidos', () => {
    cy.wait('@getConfig');

    cy.get('[data-testid="switchNotificacionEstatus"]').then(($switch) => {
      const isChecked = $switch.prop('checked');

      if (!isChecked) { //CASO 1: Switch está apagado
        cy.log('Switch inicia apagado');
        cy.get('[data-testid="switchNotificacionEstatus"]').click();

        cy.wait('@updateConfig');// Espera el PUT que guarda el cambio
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
