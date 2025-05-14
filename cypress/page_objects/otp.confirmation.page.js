import CommonComponents  from "./common.components";

class OtpConfirmationPage extends CommonComponents {
    get codeInpt() {return cy.get('#verificationFormCodeInputField')}
    get loginHeader() {return cy.get('.header-login.top-header')}
    get emailDisplay() {return cy.get('#contactInformation p')}
    get goToApplicationsBtn() {return cy.get('#backToA2D1Link')}
    get userEmailConfirmInpt() {return cy.get('[name="email"]')}
    get continueBtn() {return cy.get('#sign-in-button')}
}

export default new OtpConfirmationPage();