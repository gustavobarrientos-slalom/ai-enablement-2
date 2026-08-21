import React from 'react';

import TaskRow from './TaskRow';

function TaskListSkeleton() {
  return (
    <ul className="animate-pulse space-y-3" aria-hidden="true">
      {[0, 1, 2].map((key) => (
        <li key={key} className="h-10 rounded-md bg-card" />
      ))}
    </ul>
  );
}

function TaskList({
  tasks,
  isLoading,
  error,
  onRetry,
  sortBy,
  onSortChange,
  onUpdate,
  onDelete,
  deletingId,
}) {
  return (
    <section aria-labelledby="task-list-heading" className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="task-list-heading" className="text-lg font-semibold text-foreground">
          Items from database
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm text-muted-foreground">
            Sort by
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="created_at">Date added</option>
            <option value="due_date">Due date</option>
          </select>
        </div>
      </div>

      <div aria-live="polite">
        {error && (
          <div role="alert" className="mb-3 rounded-md border border-destructive bg-background p-3 text-destructive">
            <p>{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 rounded-md border border-destructive px-3 py-1 text-sm font-semibold text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {isLoading && <TaskListSkeleton />}

        {!isLoading && tasks.length === 0 && !error && (
          <p className="text-muted-foreground">No items found. Add some!</p>
        )}

        {!isLoading && tasks.length > 0 && (
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isDeleting={deletingId === task.id}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default TaskList;
