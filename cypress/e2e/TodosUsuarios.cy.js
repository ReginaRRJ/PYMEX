
describe('PA01001. Inicio sesión', () => {
  const initialUrl='http://localhost:5173/'
  beforeEach(() => {
    cy.visit(initialUrl)
  })

  it('Administrador', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('carolina@admin.com')
    cy.get('input').last().type('admin1234')
    cy.get('#login-button').click()
    cy.url().should('include', '/admin')
  })

  it('Dueño/Cliente', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('nancy@dueño.com')
    cy.get('input').last().type('dueñoNancy')
    cy.get('#login-button').click()
    cy.url().should('include', '/client')
  })

  it('Proveedor', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('santiago@proveedor.com')
    cy.get('input').last().type('proveedorSanti')
    cy.get('#login-button').click()
    //cy.url().should('include', '/Proveedor')
  })
  
   /*
  it('Vendedor', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('regina@vendedor.com')
    cy.get('input').last().type('vendedorRe')
    cy.get('#login-button').click()
    //cy.url().should('include', '/vendedor')
  })

  */

  it('Sucursal', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('mich@sucursal.com')
    cy.get('input').last().type('sucursalMich')
    cy.get('#login-button').click()
    cy.url().should('include', '/sucursal')
  })

  it('Incorrecto', () => {
    cy.contains('Iniciar sesión')
    cy.get('input').first().type('No@Usuario.com')
    cy.get('input').last().type('ContraseñaIncorrecta')
    cy.get('#login-button').click()
    cy.url().should('eq', initialUrl);

  })

})

// -----------------------------------------------------------------------------------

describe('PA01002. Cerrar Sesión', () => {
  it('Administrador', () => {
    cy.loginAdmin()
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })

   /*
  it('Dueño/Cliente', () => {
    cy.loginDueño()
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })
  it('Sucursal', () => {
    cy.loginSucursal()
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })
  it('Proveedor', () => {
    cy.loginProveedor()
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })
  it('Vendedor', () => {
    cy.loginVendedor()
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })

  */
})

// -----------------------------------------------------------------------------------

describe('PA01003.Perfiles', () => {
  it('AdminPerfil', () => {
    cy.loginAdmin()
    cy.get('#perfil-info').should('contain', 'carolina@admin.com')
  })


})