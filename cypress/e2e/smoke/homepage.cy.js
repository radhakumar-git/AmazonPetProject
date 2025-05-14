import homePage from "../../page_objects/home.page";
import uiTexts from "../../fixtures/uiTexts.json"

describe('Homepage should Loads', () => {
    it('Should open homepage', () => {
        cy.visit('/');
        homePage.title.should('be.visible').and('have.text', uiTexts.homePageTitle);
    });
});