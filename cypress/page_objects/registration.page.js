import CommonComponents from "./common.components";

class RegistrationPage extends CommonComponents{
    get loginBtn() {return cy.get('#createAccountLoginLink')}
    get emailInpt() {return cy.get('#usernameFormUsernameInputField')}
    get passwordInpt() {return cy.get('#passwordFormNewPasswordInputField')}
    get confirmPasswordInpt() {return cy.get('#passwordFormConfirmNewPasswordInputField')}
    get existedEmailAlert() {return cy.get('#usernameFormUsernameInputFieldError')}
}
export default new RegistrationPage();