const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Add task', () => {
  test('adds a new task through the form', async ({ page }) => {
    const todo = new TodoPage(page);
    const description = `E2E add task ${Date.now()}`;

    await todo.goto();
    await todo.addTask(description);

    await expect(todo.taskRow(description)).toBeVisible();
    await expect(todo.descriptionInput).toHaveValue('');
  });

  test('prevents submitting a blank task', async ({ page }) => {
    const todo = new TodoPage(page);

    await todo.goto();
    await todo.descriptionInput.fill('   ');

    await expect(todo.addButton).toBeDisabled();
  });
});
