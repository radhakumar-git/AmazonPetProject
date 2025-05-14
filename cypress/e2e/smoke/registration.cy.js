import { faker } from '@faker-js/faker';
import homePage from "../../page_objects/home.page";
import registrationPage from "../../page_objects/registration.page";
import uiTexts from "../../fixtures/uiTexts.json";
import user from "../../fixtures/userCredentials.json";
import otpConfirmationPage from '../../page_objects/otp.confirmation.page';

describe('Registration Flow', () => {
    beforeEach(() => {
        cy.visit('/');
        homePage.userMenuBtn.click();
        homePage.myProfileOption.click();
    });

    it("Should register with valid credentials and reach email confirmation page", () => {
        const fakeUserEmail = faker.internet.email();

        registrationPage.emailInpt.type(fakeUserEmail);
        registrationPage.passwordInpt.type(user.password);
        registrationPage.confirmPasswordInpt.type(user.password);
        registrationPage.submitBtn.click();

        cy.url().should('include', '/verificationCodeSent');
        otpConfirmationPage.pageHeader.should('be.visible').and('have.text', uiTexts.otpEmailVerificationHeader);
        otpConfirmationPage.submitBtn.should('be.visible').and('have.css', 'background-color', 'rgb(255, 151, 0)');
    });

    it("Should not register with already registered email", () => {
        registrationPage.emailInpt.type(user.login);
        registrationPage.passwordInpt.type(user.password);
        registrationPage.confirmPasswordInpt.type(user.password);
        registrationPage.submitBtn.click();

        cy.url().should('include', '/createaccount');
        registrationPage.existedEmailAlert.should('be.visible').and('have.text', uiTexts.existedEmailErrorMessage);
    });
});