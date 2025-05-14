import homePage from "../../page_objects/home.page";
import testData from "../../fixtures/testData.json"
import jobsListPage from "../../page_objects/jobs.list.page";
import jobDetailsPage from "../../page_objects/job.details.page";
import uiTexts from "../../fixtures/uiTexts.json"

describe('Job listing opens correctly', () => {
    beforeEach(() => {
        cy.visit('/');
        homePage.searchInpt.type(testData.searchingRole);
        homePage.searchBtn.click();
        jobsListPage.jobTitles.first().click();
      });

    it('Should open job details page and verify job title', () => {
        cy.url().should('include', '/jobs/');
        jobDetailsPage.jobTitle.should("have.text", testData.searchingRole);
    });

    it('Should display job description and Apply button', () => {
        jobDetailsPage.jobDescriptionTitle.should('be.visible').and('have.text', uiTexts.jobDescription);
        jobDetailsPage.applyBtn.should('be.visible').and("have.text", uiTexts.applyBtn)
    });
});