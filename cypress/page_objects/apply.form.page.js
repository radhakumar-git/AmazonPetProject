class ApplyFormPage {
    get title() { return cy.get('.display-2')}
    get smsSkipBtn() { return Cypress.$('#save-and-continue-form-button')}
    get formDropdowns() { return Cypress.$('.select2-selection[aria-required="true"]')}
    get formDropdownOptions() { return cy.get('[role="option"]')}
    get radioBtns() { return Cypress.$('input[type="radio"][aria-required="true"]')}
    get checkboxes() { return Cypress.$('input[type="checkbox"]')}
    get reviewFormTitle() { return cy.get('.application-review-form-title')}
    get formTextInpts() { return Cypress.$('input[type="text"][aria-required="true"]')}
    get applyInEnglish() { return cy.get('.card-body > .btn')}
    get continueBtn() { return cy.get('.btn.btn-primary[type="button"]:not([data-dismiss="modal"])')}
    get submitBtn() {
        const selector = '.btn.btn-primary.submit[type="submit"]';
        return {
            jq: Cypress.$(selector),
            cy: () => cy.get(selector)
        };
    }

    clickOnSkipBtn() {
        cy.waitForStableDOM().then(() => {
            if (this.smsSkipBtn.length < 1) return;
            cy.wrap(this.smsSkipBtn).should('be.visible').scrollIntoView().click({force: true});
        });
    }

    fillDropdowns() {
        const fillNextDropdown = () => {
            const dropdowns = this.formDropdowns;
            const unfilled = dropdowns.filter((i, el) => {
                const text = Cypress.$(el).text().trim();
                return !text || text.includes('Select an option');
            });

            if (unfilled.length === 0) {
                cy.log('Dropdowns are filled');
                return;
            }

            cy.wrap(unfilled[0]).click({force: true});
            this.formDropdownOptions.should('be.visible').first().click({force: true});
            cy.get('body').click('topLeft');
            cy.get('body').type('{esc}');
            cy.wait(300).then(() => {
                fillNextDropdown();
            });
        };
        return cy.then(() => fillNextDropdown());
    }

    fillRadios() {
        const radios = this.radioBtns;
        if (radios.length < 1) return;

        return cy.wrap(radios).each((radio) => {
            const value = Cypress.$(radio).attr('value');
            if (['NO', '1', 'NEVER', 'MALE'].includes(value)) {
                cy.wrap(radio).check({ force: true });
            }
        });
    }

    fillCheckboxes() {
        const checkboxes = this.checkboxes;
        if (checkboxes.length < 1) return;

        return cy.wrap(checkboxes).each((checkbox) => {
            cy.wrap(checkbox).check({ force: true });
        });
    }

    fillInputTextFields(text) {
        const inputs = this.formTextInpts;
        if (inputs.length < 1) return;

        return cy.wrap(inputs).each((input) => {
            const value = Cypress.$(input).val();
            if (!value || value === '') {
                cy.wrap(input).type(text);
            }
        });
    }

    fillEverything(text) {
        return cy.then(() => {
            return this.fillDropdowns()}).then(() => this.fillRadios())
                .then(() => this.fillCheckboxes())
                .then(() => this.fillInputTextFields(text));
    }

    FillAndGoToSubmit(text) {
        const loop = () => {
            this.fillEverything(text).then(() => {
                // Check if the submit button is visible
                if (this.submitBtn.jq.is(':visible')) {
                    cy.log('Submit button is visible');
                    return;
                }
    
                // If not, check if applyInEnglish button exists and is visible
                if (this.applyInEnglishBtn?.jq?.is(':visible')) {
                    cy.log('Clicking Apply in English button');
                    this.applyInEnglishBtn.click({ force: true });
                    cy.wait(500).then(() => loop());
                    return;
                }
    
                cy.log('Submit not found yet. Clicking Continue...');
                this.continueBtn.should('be.visible').scrollIntoView().click({ force: true });
                cy.wait(500).then(() => {
                    loop();
                });
            });
        };
        return cy.then(() => loop());
    }
    
}

export default new ApplyFormPage();