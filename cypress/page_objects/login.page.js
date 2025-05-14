import CommonComponents from "./common.components";

class LoginPage extends CommonComponents {
    get loginWithTitle() {return cy.get('.card-title').first()}
    get emailInpt() {return cy.get('#loginFormUsernameInputField')}
    get emailConfirmInput() {return cy.get('[name="email"]')}
    get passwordInpt() {return cy.get('#loginFormPasswordInputField')}
    get verifyingSpinner() {return cy.get('#loadingToast')}
    get loginErrorMessage() {return cy.get('#loginFormPasswordInputFieldError')}
}

export default new LoginPage();