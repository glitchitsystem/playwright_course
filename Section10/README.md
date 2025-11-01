# Playwright Boilerplate Project - JS

Minimal Playwright setup for JavaScript end-to-end testing.

## Requirements

- Node.js v16+ recommended

## Installation

`npm i`

If browsers are missing, run:
`npx playwright install`

## Running Tests

- Run all tests:
  `npm test`
- Run tests in UI mode:
  `npm run test:ui`
- Run tests in headed mode:
  `npm run test:headed`
- Debug tests:
  `npm run test:debug`
- Run Chromium tests:
  `npm run test:chromium`
- Run Firefox tests:
  `npm run test:firefox`
- Run WebKit tests:
  `npm run test:webkit`
- Run tests with a single worker:
  `npm run test:single`
- Run smoke tests:
  `npm run test:smoke`
- Show test report:
  `npm run report`

## Adding Tests

- Place new test files in the `tests/` folder.
- Use `.spec.js` naming convention.

## Updating Playwright

To update Playwright and browser binaries:
`npm install @playwright/test@latest --save-dev`
`npx playwright install`

## Troubleshooting

- If you see browser not found errors, run `npx playwright install`.
- If tests fail unexpectedly, check Node.js version and dependencies.
