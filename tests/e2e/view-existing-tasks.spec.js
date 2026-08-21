const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('View existing tasks', () => {
  test('loads the TODO page and shows the task list', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await expect(page.getByRole('heading', { name: 'To Do App' })).toBeVisible();
    await expect(todo.taskListHeading).toBeVisible();
    // Seeded sample tasks should render once loading finishes
    await expect(page.getByRole('listitem').first()).toBeVisible();
  });
});
