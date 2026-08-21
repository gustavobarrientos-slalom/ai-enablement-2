const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Empty state', () => {
  test('shows the empty state when there are no tasks', async ({ page }) => {
    const todo = new TodoPage(page);

    // Mock the API response so this test is isolated from real seeded/created data
    await page.route('**/api/tasks*', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
      return route.continue();
    });

    await todo.goto();

    await expect(todo.emptyStateMessage).toBeVisible();
  });
});
