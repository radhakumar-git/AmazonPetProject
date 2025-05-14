class JobDetailsPage {
    get jobTitle() {return cy.get('h1[class="title"]')}
    get jobLocation() {return cy.get('[class="association location-icon"] li')}
    get jobDescriptionTitle() {return cy.get('.section.description + div h2')}
    get applyBtn() {return cy.get('#apply-button')}
}

export default new JobDetailsPage();