import homePage from "../../page_objects/home.page";
import testData from "../../fixtures/testData.json"
import jobsListPage from "../../page_objects/jobs.list.page";

describe('Search by keyword and location', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Should earch by keyword', () => {
        homePage.searchInpt.type(testData.searchingRole);
        homePage.searchBtn.click();

        cy.url().should('include', '/search');
        jobsListPage.jobTitles.should('have.length.greaterThan', 0);
        jobsListPage.jobTitles.eq(1).should('contain.text', testData.searchingRole);
    });

    it('Should search by location', () => {
        homePage.locationInpt.type(testData.searchingLocation);
        homePage.locationDropdownOptions.contains(testData.searchingLocationDisplay).type('{enter}', {delay: 100});
        homePage.searchBtn.type('{enter}');

        cy.url().should('include', '/search');
        jobsListPage.jobLocations.should('have.length.greaterThan', 0);
        jobsListPage.jobLocations.eq(1).should('contain.text', testData.searchingLocation);
    });
});