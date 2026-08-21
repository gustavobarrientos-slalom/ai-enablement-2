import React, { useCallback, useEffect, useState } from 'react';

import { useTheme } from './hooks/useTheme';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = useCallback(async (currentSortBy) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks?sortBy=${currentSortBy}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(sortBy);
  }, [fetchTasks, sortBy]);

  const handleAddTask = async (task) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const created = await response.json();
      setTasks((current) => [...current, created]);
      setError(null);
      return true;
    } catch (err) {
      setError('Error adding task: ' + err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updated = await response.json();
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
      setError(null);
      return true;
    } catch (err) {
      setError('Error updating task: ' + err.message);
      return false;
    }
  };

  const handleDeleteTask = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((current) => current.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-primary px-4 py-4 text-primary-foreground">
          <div>
            <h1 className="text-2xl font-bold">To Do App</h1>
            <p className="text-sm">Keep track of your tasks</p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </header>

        <section aria-labelledby="add-task-heading" className="rounded-md border border-border bg-card p-4">
          <h2 id="add-task-heading" className="sr-only">
            Add task
          </h2>
          <TaskForm onSubmit={handleAddTask} isSubmitting={isSubmitting} />
        </section>

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onRetry={() => fetchTasks(sortBy)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
}

export default App;
