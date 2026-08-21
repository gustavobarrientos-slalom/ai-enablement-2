import React, { useState } from 'react';

function TaskRow({ task, onUpdate, onDelete, isDeleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setDescription(task.description);
    setDueDate(task.due_date || '');
    setIsEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (description.trim() === '') {
      return;
    }

    setIsSaving(true);
    const succeeded = await onUpdate(task.id, {
      description: description.trim(),
      due_date: dueDate || null,
    });
    setIsSaving(false);

    if (succeeded) {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center">
        <form onSubmit={handleSave} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor={`edit-description-${task.id}`}>
            Task description
          </label>
          <input
            id={`edit-description-${task.id}`}
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label className="sr-only" htmlFor={`edit-due-date-${task.id}`}>
            Due date
          </label>
          <input
            id={`edit-due-date-${task.id}`}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving || description.trim() === ''}
              className="h-10 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="h-10 rounded-md border border-border px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="break-words text-foreground">{task.description}</p>
        {task.due_date && (
          <p className="text-sm text-muted-foreground">Due {task.due_date}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={startEditing}
          className="h-11 min-w-[44px] rounded-md border border-border px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          aria-label={`Delete ${task.description}`}
          className="h-11 min-w-[44px] rounded-md bg-destructive px-3 text-sm font-semibold text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default TaskRow;
