import { registerCommand } from 'cypress-wait-for-stable-dom';
registerCommand();

Cypress.Commands.add('login', (loginPage, otpConfirmationPage, user) => {
    cy.visit('https://passport.amazon.jobs/');
        loginPage.emailInpt.type(user.login)
        loginPage.passwordInpt.type(user.password)
        loginPage.submitBtn.trigger('mouseover').click();
        cy.task('getGmailOtp').then((otp) => {
            otpConfirmationPage.codeInpt.type(otp);
        });
        otpConfirmationPage.submitBtn.first().click();
});