const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Example E2E smoke', () => {
  test('loads the TODO app shell', async ({ page }) => {
    const todo = new TodoPage(page);

    await todo.goto();

    await expect(todo.page.getByRole('heading', { name: /todo/i })).toBeVisible();
  });
});
