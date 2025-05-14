class JobsListPage {
    get jobTitles() {return cy.get('.job-tile h3 a')}
    get jobLocations() {return cy.get('.text-nowrap')}
}

export default new JobsListPage();