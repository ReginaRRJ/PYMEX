describe('PA09001. LeerUsuario: CRUD', () => {
    it('Visualización de los usuarios ', () => {
      cy.loginAdmin()
      cy.get ('#usuarios-list').find ('tr').should('have.length.greaterThan', 0)
    })
     it('Mensaje si no hay usuarios', () => {
        cy.loginAdmin();

        // Interceptamos la solicitud y validamos directamente
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

//-----------------------------------------------------------------------------------------
  describe('PA09003. UpdateUsuario: CRUD', () => {
    it('Actualizar Usuario Jin a Namjoon', () => {
        cy.loginAdmin()
        cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@seokjin.kr') .click()
        cy.get ('[data-testid="input-apellido"]').clear().type('NamJoon')
        cy.get ('[data-testid="input-correo"]').clear().type('kim@namjoon.kr')
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
        cy.get ('#usuarios-list').find ('tr').contains('td', 'kim@namjoon.kr') .click()
        cy.get('#delete-button').click()
    })
  })

//-----------------------------------------------------------------------------------------
describe('PA09005. Seguimiento de Reportes', () => {
    it('Visualizar Reportes', () => {
        cy.loginAdmin()
    })
    it('Actualización de Estados', () => {
        cy.loginAdmin()
    })
  })