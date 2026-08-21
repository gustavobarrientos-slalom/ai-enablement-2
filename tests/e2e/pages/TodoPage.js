class TodoPage {
  constructor(page) {
    this.page = page;
    this.descriptionInput = page.getByLabel('Add new item');
    this.dueDateInput = page.getByLabel('Due date (optional)');
    this.addButton = page.getByRole('button', { name: 'Add item' });
    this.sortBySelect = page.getByLabel('Sort by');
    this.taskListHeading = page.getByRole('heading', { name: 'Items from database' });
    this.emptyStateMessage = page.getByText('No items found. Add some!');
    this.errorAlert = page.getByRole('alert');
    this.retryButton = page.getByRole('button', { name: 'Retry' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTask(description, dueDate) {
    await this.descriptionInput.fill(description);
    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }
    await this.addButton.click();
  }

  taskRow(description) {
    return this.page.getByRole('listitem').filter({ hasText: description });
  }

  async deleteTask(description) {
    await this.taskRow(description).getByRole('button', { name: `Delete ${description}` }).click();
  }

  async sortBy(option) {
    await this.sortBySelect.selectOption(option);
  }
}

module.exports = { TodoPage };
