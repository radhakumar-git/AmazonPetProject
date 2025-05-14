import homePage from "../../page_objects/home.page";
import jobDetailsPage from "../../page_objects/job.details.page";
import jobsListPage from "../../page_objects/jobs.list.page";
import loginPage from "../../page_objects/login.page";
import otpConfirmationPage from "../../page_objects/otp.confirmation.page";
import applyFormPage from "../../page_objects/apply.form.page";
import uiTexts from "../../fixtures/uiTexts.json"
import testData from "../../fixtures/testData.json"
import user from "../../fixtures/userCredentials.json";


describe('Apply Now Flow', () => {
    it('Should login, click Apply Now, open and fill application form', () => {
        cy.login(loginPage, otpConfirmationPage, user);
        otpConfirmationPage.goToApplicationsBtn.click()
        otpConfirmationPage.userEmailConfirmInpt.type(user.login);
        otpConfirmationPage.continueBtn.click();
        homePage.logoNavigationBtn.click();
        homePage.searchInpt.type(testData.roles[Math.floor(Math.random() * testData.roles.length)]);
        homePage.searchBtn.click();
        jobsListPage.jobTitles.then(titles => cy.wrap(titles[Math.floor(Math.random() * titles.length)]).click());
        jobDetailsPage.applyBtn.click();

        applyFormPage.title.should('have.text', uiTexts.applyFormTitle);
        applyFormPage.clickOnSkipBtn();
        applyFormPage.FillAndGoToSubmit(testData.searchingRole);

        applyFormPage.reviewFormTitle.should('be.visible').and('have.text', uiTexts.reviewFormTitle);
        applyFormPage.submitBtn.cy().should('be.visible').and('have.text',uiTexts.submitBtnText);
    });

    after(() => {
        cy.task('markAllAsRead');
    })
});