import React, { useState } from 'react';

function TaskForm({ onSubmit, isSubmitting }) {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isBlank = description.trim() === '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBlank || isSubmitting) {
      return;
    }

    const succeeded = await onSubmit({
      description: description.trim(),
      due_date: dueDate || null,
    });

    // Preserve the input value if submission fails so the user doesn't retype it.
    if (succeeded) {
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-foreground">
          Add new item
        </label>
        <input
          id="task-description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter a task"
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="task-due-date" className="mb-1 block text-sm font-medium text-foreground">
          Due date (optional)
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
        />
      </div>
      <button
        type="submit"
        disabled={isBlank || isSubmitting}
        className="h-11 shrink-0 rounded-md bg-primary px-4 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Adding…' : 'Add item'}
      </button>
    </form>
  );
}

export default TaskForm;
