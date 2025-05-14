# Amazon Career Site - Cypress UI Automation

This is a small pet project designed to test basic functionality of the [Amazon Global Career Site](https://www.amazon.jobs/) using **Cypress**, following **Page Object Model (POM)** best practices.

## 🚀 Goal
Automate a few smoke test cases to validate the "Find Jobs" flow on Amazon's career website, including:
- Opening the homepage
- Navigating to job search
- Filtering for QA/Automation positions
- Navigating to job details
- Clicking “Apply Now” (form **not submitted**)

## 🛠 Tech Stack
- Cypress
- JavaScript
- Page Object Model (POM)
- GitHub Actions (CI/CD)

## 📁 Project Structure
```
cypress/
  e2e/                # Test cases
  pages_objects/      # Page Object classes
  fixtures/           # Test data
cypress.config.js     # Cypress configuration
```

## ✅ Best Practices Used
- Page Object Model
- Fixtures for test data
- Clean code structure
- `.gitignore` included
- No hardcoded data
- Public GitHub repo
- GitHub Actions for CI

## 📌 Important Note
This is a test-only project. No forms are submitted to avoid sending unwanted data to the Amazon website.

---

## 🧪 How to Run

1. Install dependencies:
```bash
npm install
```

2. Run Cypress UI:
```bash
npx cypress open
```

3. Or run in headless mode:
```bash
npx cypress run
```