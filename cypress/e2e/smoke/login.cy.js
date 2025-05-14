import homePage from "../../page_objects/home.page";
import loginPage from "../../page_objects/login.page";
import registrationPage from "../../page_objects/registration.page";
import uiTexts from "../../fixtures/uiTexts.json";
import user from "../../fixtures/userCredentials.json";
import otpConfirmationPage from "../../page_objects/otp.confirmation.page";

describe('Login Flow', () => {
    beforeEach(function () {
        if (this.currentTest.title === 'Should log in directly and handle OTP') {
            return;
        }
        cy.visit('/');
        homePage.userMenuBtn.click();
        homePage.myProfileOption.click();
    });

    it("Should attempt to log in with valid credentials or get server error", () => {
        registrationPage.pageHeader.should('exist');
        registrationPage.pageHeader.should('have.text', uiTexts.registrationHeader);
        registrationPage.loginBtn.click();
        
        loginPage.pageHeader.should('have.text', uiTexts.loginHeader);
        loginPage.emailInpt.type(user.login)
        loginPage.passwordInpt.type(user.password)
        loginPage.submitBtn.trigger('mouseover').click();

        loginPage.verifyingSpinner.should('be.visible').and('contain.text', uiTexts.verifyingSpinner);
        loginPage.verifyingSpinner.should('not.be.visible');
        loginPage.loginErrorMessage.should('be.visible').and('have.text', uiTexts.loginErrorMessage);
    });

    it("Should not log in with invalid email and display error message", () => {
        registrationPage.loginBtn.click();
        loginPage.emailInpt.type(user.fakeLogin)
        loginPage.passwordInpt.type(user.password)
        loginPage.submitBtn.trigger('mouseover').click();

        loginPage.loginErrorMessage.should('be.visible').and('have.text', uiTexts.wrongCredentialsErrorMessage);
    });

    it('Should log in directly and handle OTP', () => {
        cy.visit('https://passport.amazon.jobs/');
        loginPage.emailInpt.type(user.login)
        loginPage.passwordInpt.type(user.password)
        loginPage.submitBtn.trigger('mouseover').click();

        otpConfirmationPage.pageHeader.should('have.text', uiTexts.otpConfirmationHeader);
        cy.task('getGmailOtp').then((otp) => {
            otpConfirmationPage.codeInpt.type(otp);
        });
        otpConfirmationPage.submitBtn.first().click();

        otpConfirmationPage.loginHeader.should('have.text', uiTexts.loggedInHeader);
        otpConfirmationPage.emailDisplay.should('have.text', user.login);
    });
});