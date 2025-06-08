describe('PA09001. LeerUsuario: CRUD', () => {
  it('Visualización de los usuarios ', () => {
    cy.loginAdmin()
    cy.get ('#usuarios-list').find ('tr').should('have.length.greaterThan', 0)
  })
  it('Mensaje si no hay usuarios', () => {
    cy.loginAdmin();
    cy.intercept('GET', 'http://localhost:3001/api/usuarios', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
      });
    }).as('getUsuariosVacios');
    cy.visit('http://localhost:5173/admin'); 
    cy.wait('@getUsuariosVacios');
    cy.get('#usuarios-list').should('contain', 'No se encontraron usuarios.');
  });
})

describe('PA09002. CrearUsuario: CRUD', () => {
  it('CrearUsuarioJin', () => {
    cy.loginAdmin()
    cy.get("#add-user-button").click()
    cy.get('[data-testid="input-nombre"]').type('Kim')
    cy.get('[data-testid="input-apellido"]').type('SeokJin')
    cy.get('[data-testid="input-correo"]').type('kim@seokjin.kr')
    cy.get('[data-testid="input-contraseña"]').type('WHYK')
    cy.get('[data-testid="select-rol"]').select('Vendedor')

    cy.get('#crearUsuario_button').click()
    cy.logOut()

    cy.get('input').first().type('kim@seokjin.kr')
    cy.get('input').last().type('WHYK')
    cy.get('#login-button').click()
    //cy.url().should('include', '/vendedor')
  })
})

describe('PA09003. UpdateUsuario: CRUD', () => {
  it('Actualizar Usuario Jin a Namjoon', () => {
    cy.loginAdmin()
    cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@seokjin.kr') .click()
    cy.get ('[data-testid="inputActualizar-apellido"]').clear().type('NamJoon')
    cy.get ('[data-testid="inputActualizar-correo"]').clear().type('kim@namjoon.kr')
    cy.get('#update-button').click()

    cy.wait(6000)

    cy.logOut()
    cy.get('input').first().type('kim@namjoon.kr')
    cy.get('input').last().type('WHYK')
    cy.get('#login-button').click()
    cy.url().should('include', '/vendedor')

    })
})

describe('PA09004. DeteleUsuario: CRUD', () => {
  it('Eliminar Usuario Namjoon', () => {
    cy.loginAdmin()
    cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@namjoon.kr').click()
    cy.get('#delete-button').click()
    cy.reload()
    cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@namjoon.kr').should('not.exist');
  })
})

describe('PA09005. Seguimiento de Reportes', () => {
  it('Visualizar Reportes', () => {
    cy.loginAdmin()
    cy.get('#Navbar').contains('Reportes').click()
    cy.get('#info-reporte').children().should('have.length.greaterThan', 0)
    cy.get('#info-reporte').find('[data-testid="UpdateEstadoReport-button"]').should('exist');
  })


  it('Mensaje si no hay reportes', () => {
    cy.intercept('GET', 'http://localhost:3001/reportes', {
      statusCode: 200,
      body: [],
    }).as('getReportesVacios');
    
    cy.loginAdmin()
    cy.get('#Navbar').contains('Reportes').click();
    cy.wait('@getReportesVacios');
    cy.get('#info-reporte').should('contain', 'No hay reportes disponibles.');
  });  


  it('Actualización de Estado de un Reporte', () => {
  cy.loginAdmin(); 
  cy.get('#Navbar').contains('Reportes').click();

  // Paso 1: Obtener todos los reportes
  cy.request('GET', 'http://localhost:3001/reportes').then((response) => {
    const reportes = response.body;
    const pendiente = reportes.find(r => !r.resuelto); // Paso 2: Buscar uno que aún no esté resuelto

    if (pendiente) {
      const idReporte = pendiente.idReporte;

      cy.get(`[data-testid="reporte-row-${idReporte}"]`)
        .find('[data-testid="UpdateEstadoReport-button"]')
        .click();

      cy.wait(500); 
      cy.request('GET', 'http://localhost:3001/reportes').then((res) => {
        const actualizado = res.body.find(r => r.idReporte === idReporte);
        expect(actualizado).to.exist;
        expect(actualizado.resuelto).to.be.true;
      });
    } else {
      cy.log('No hay reportes pendientes por resolver');
    }
  });
});

})