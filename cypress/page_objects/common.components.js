class CommonComponents {
    get pageHeader() {return cy.get('#pageHeader')}
    get submitBtn() {return cy.get('button[type="submit"]')}
    get rejectCookiesBtn() {return cy.get('#btn-reject-cookies')}
    get logoNavigationBtn() {return cy.get('.navbar-brand')}
}

export default CommonComponents;