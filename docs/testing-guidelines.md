# Testing Guidelines

## Purpose

Tests should protect the TODO app's user workflows and API contract while remaining fast, isolated, and easy to diagnose. Add the smallest test that proves the behavior, then extend coverage when a change crosses a module or user-facing boundary.

## Test Layers

### Frontend unit and component tests

Place frontend tests in `packages/frontend/src/__tests__/` and name them after the component or behavior under test, using `.test.js` or `.test.jsx`. Use Jest through Create React App, React Testing Library for rendering and queries, `@testing-library/user-event` for interactions, and `@testing-library/jest-dom` for DOM assertions.

Test behavior visible to a user:

- initial loading state
- successful task loading and rendering
- empty list state
- adding a task through the form
- preventing blank task submission
- delete behavior and pending states
- fetch and mutation errors
- accessible names, labels, and keyboard interaction

Use accessible queries such as `getByRole`, `getByLabelText`, and `findByText`. Use placeholders only when no accessible label is available. Avoid asserting implementation details, CSS class names, or private React state.

Mock network requests with MSW. Define default handlers for the successful path, override handlers inside individual tests for errors or alternate responses, reset handlers after each test, and close the server after the suite.

### Backend unit and integration tests

Place backend tests in `packages/backend/__tests__/`; place endpoint integration tests in `packages/backend/__tests__/integration/` when that directory is needed. Use Jest with Supertest against the Express `app` so endpoint tests do not require a listening network server.

Cover the API contract for each endpoint:

- successful response status and JSON shape
- required-field and malformed-input validation
- missing-resource behavior
- invalid identifiers
- persistence effects for create and delete operations

Keep database setup deterministic. Clean up database connections in `afterAll`, and avoid relying on test execution order or data created by another test. Prefer unique test data and assert only the records relevant to the current test.

### End-to-end tests

Place Playwright tests in `tests/e2e/` and use `.spec.js` or `.spec.ts`. Use the Page Object Model and run the configured Chromium project only. Keep the suite focused on five to eight independent critical journeys rather than duplicating component tests.

Prioritize journeys such as:

- loading the TODO page and seeing existing tasks
- adding a task
- deleting a task
- displaying the empty state
- recovering from an API failure when the workflow supports recovery

Each E2E test must establish its own data or use a controlled fixture. Do not depend on another test's created records, browser state, or execution order.

## Commands

Run commands from the repository root:

| Goal | Command |
| --- | --- |
| Frontend tests with coverage | `npm run test:frontend` |
| Backend Jest tests | `npm run test:backend` |
| Unit tests for both packages | `npm test` |
| Backend integration tests | `npm run test:integration` |
| Playwright E2E tests | `npm run test:e2e` |
| Install Chromium for E2E tests | `npm run test:e2e:install` |
| Full test suite | `npm run test:all` |

Use a package-level command while iterating on one slice, then run the smallest affected root command before completing the change. Run `npm run test:all` for changes that affect shared API contracts, startup behavior, or complete user workflows.

## Test Quality Rules

- Give each test one clear behavioral purpose and a descriptive name.
- Assert outcomes and important side effects, not internal implementation steps.
- Keep tests deterministic: control time, network responses, randomness, and external state when they affect the result.
- Reset mocks and handlers between tests; close servers, database connections, and other resources after suites.
- Exercise both success and failure paths for new network or persistence behavior.
- Keep assertions specific enough to catch regressions without overfitting to copy or markup that is not part of the contract.
- Do not weaken or delete a failing test to make a change pass. Investigate whether the product behavior, test fixture, or test expectation is incorrect.

## Coverage Expectations

For a new TODO feature, add tests at the lowest useful layer and at the user-facing boundary when risk warrants it. A backend-only validation change needs endpoint coverage; a UI workflow change needs component coverage and, when it affects the complete journey, an E2E test. Include loading, empty, error, and success states whenever the feature communicates with the API.

Before opening a pull request, confirm that the relevant tests pass, new behavior has regression coverage, and the test output does not leave open handles or unclosed resources.