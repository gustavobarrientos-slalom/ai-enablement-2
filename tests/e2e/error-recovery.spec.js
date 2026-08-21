const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('API failure recovery', () => {
  test('shows an error and recovers after a successful retry', async ({ page }) => {
    const todo = new TodoPage(page);
    let shouldFail = true;

    // React StrictMode fires the initial fetch twice in development; keep failing
    // until the error is confirmed on screen, then let the retry succeed.
    await page.route('**/api/tasks*', (route) => {
      if (route.request().method() !== 'GET') {
        return route.continue();
      }
      if (shouldFail) {
        return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      }
      return route.continue();
    });

    await todo.goto();

    await expect(todo.errorAlert).toBeVisible();
    shouldFail = false;
    await todo.retryButton.click();

    await expect(todo.errorAlert).toHaveCount(0);
    await expect(page.getByRole('listitem').first()).toBeVisible();
  });
});
