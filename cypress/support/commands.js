// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginAdmin', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input').first().type('carolina@admin.com')
    cy.get('input').last().type('admin1234')
    cy.get('#login-button').click()
    cy.url().should('include', '/admin')
  })

  Cypress.Commands.add('loginDueño', () => { //cliente
    cy.visit('http://localhost:5173/')
    cy.get('input').first().type('nancy@dueño.com')
    cy.get('input').last().type('dueñoNancy')
    cy.get('#login-button').click()
    cy.url().should('include', '/client')
  })

  Cypress.Commands.add('loginSucursal', () => { 
    cy.visit('http://localhost:5173/')
    cy.get('input').first().type('mich@sucursal.com')
    cy.get('input').last().type('sucursalMich')
    cy.get('#login-button').click()
    cy.url().should('include', '/sucursal')
  })

  Cypress.Commands.add('loginProveedor', () => { 
    cy.visit('http://localhost:5173/')
    cy.get('input').first().type('santiago@proveedor.com')
    cy.get('input').last().type('proveedorSanti')
    cy.get('#login-button').click()
    cy.url().should('include', '/sucursal')
  })
  Cypress.Commands.add('loginVendedor', () => { 
    cy.visit('http://localhost:5173/')
    cy.get('input').first().type('regina@vendedor.com')
    cy.get('input').last().type('vendedorRe')
    cy.get('#login-button').click()
    cy.url().should('include', '/sucursal')
  })


  Cypress.Commands.add('logOut', () => { 
    cy.get('#logout-button').click()
    cy.url().should('include', '/')
  })