const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Delete task', () => {
  test('deletes a task the test created', async ({ page }) => {
    const todo = new TodoPage(page);
    const description = `E2E delete task ${Date.now()}`;

    await todo.goto();
    await todo.addTask(description);
    await expect(todo.taskRow(description)).toBeVisible();

    await todo.deleteTask(description);

    await expect(todo.taskRow(description)).toHaveCount(0);
  });
});
