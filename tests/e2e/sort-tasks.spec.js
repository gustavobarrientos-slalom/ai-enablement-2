const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Sort tasks', () => {
  test('sorts tasks by due date', async ({ page }) => {
    const todo = new TodoPage(page);
    const suffix = Date.now();
    const earlierTask = `E2E earlier due ${suffix}`;
    const laterTask = `E2E later due ${suffix}`;

    await todo.goto();
    await todo.addTask(laterTask, '2031-01-01');
    await todo.addTask(earlierTask, '2030-01-01');

    await todo.sortBy('due_date');

    const descriptions = await page.getByRole('listitem').allTextContents();
    const earlierIndex = descriptions.findIndex((text) => text.includes(earlierTask));
    const laterIndex = descriptions.findIndex((text) => text.includes(laterTask));

    expect(earlierIndex).toBeGreaterThanOrEqual(0);
    expect(laterIndex).toBeGreaterThanOrEqual(0);
    expect(earlierIndex).toBeLessThan(laterIndex);
  });
});
