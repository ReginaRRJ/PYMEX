
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

    cy.logOut()
    cy.get('input').first().type('kim@namjoon.kr')
    cy.get('input').last().type('WHYK')
    cy.get('#login-button').click()
    //cy.url().should('include', '/vendedor')

    })
  })

describe('PA09004. DeteleUsuario: CRUD', () => {
  it('Eliminar Usuario Namjoon', () => {
    cy.loginAdmin()
    cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@namjoon.kr').click()
    cy.get('#delete-button').click()
    cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@namjoon.kr').should('not.exist');
  })
})


//-----------------------------------------------------------------------------------------
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


  it('Actualización de Estados', () => {
    cy.loginAdmin()
    cy.get('#Navbar').contains('Reportes').click();

    cy.request('GET', 'http://localhost:3001/reportes').then((response) => {
      const $children = response.body; 

      if ($children.length > 0) {
        cy.get('[data-testid="UpdateEstadoReport-button"]').should('exist');
        
        cy.get('#info-reporte').children().first().then($firstReport => {
          const button = $firstReport.find('[data-testid="UpdateEstadoReport-button"]');
          const h1 = button.find('h1');

          if (h1.length > 0 && h1.text().trim() === 'Por resolver') {
            cy.wrap(button).click();

            cy.wait(500); // Espera para que el estado cambie en BD
            cy.reload(); 
            cy.get('#Navbar').contains('Reportes').click();

            
            cy.get('#info-reporte').children().first().then($updatedReport => {
              const updatedButton = $updatedReport.find('[data-testid="UpdateEstadoReport-button"]');
              cy.wrap(updatedButton).find('h1').should('not.have.text', 'Por resolver');
              //cy.get('[data-testid="UpdateEstadoReport-button"] img').should('be.visible');
              
            });
          } else {
            cy.log('Existen reportes, pero estan todos resueltos');
          }
          });
      } else {
        cy.log('No existe reportes que se puedan actualizar');
      }
    });
  });
})