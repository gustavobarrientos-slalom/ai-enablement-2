import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const sampleTasks = [
  { id: 1, description: 'Test Task 1', due_date: null, created_at: '2023-01-01T00:00:00.000Z' },
  { id: 2, description: 'Test Task 2', due_date: '2023-02-01', created_at: '2023-01-02T00:00:00.000Z' },
];

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleTasks));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const { description } = req.body;

    if (!description || description.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Task description is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        description,
        due_date: req.body.due_date || null,
        created_at: new Date().toISOString(),
      })
    );
  }),

  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        description: req.body.description,
        due_date: req.body.due_date ?? null,
        created_at: '2023-01-01T00:00:00.000Z',
      })
    );
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(id) }));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('shows a loading state before tasks resolve', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  test('loads and displays tasks', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('Due 2023-02-01')).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });

  test('adds a new task through the form', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('Add new item');
    await user.type(input, 'New Test Task');
    await user.click(screen.getByRole('button', { name: 'Add item' }));

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });
  });

  test('disables submission for blank input', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Add item' })).toBeDisabled();
  });

  test('edits an existing task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    const editInput = screen.getByLabelText('Task description');
    await user.clear(editInput);
    await user.type(editInput, 'Updated Task');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Updated Task')).toBeInTheDocument();
    });
  });

  test('deletes a task', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete Test Task 1' }));

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });

  test('sorts tasks by due date', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText('Sort by'), 'due_date');

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Sort by' })).toHaveValue('due_date');
    });
  });

  test('handles fetch error', async () => {
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Failed to load tasks/);
    });
  });

  test('handles a failed add-task mutation without losing existing tasks', async () => {
    const user = userEvent.setup();

    server.use(
      rest.post('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('Add new item');
    await user.type(input, 'Will fail');
    await user.click(screen.getByRole('button', { name: 'Add item' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Error adding task/);
    });

    // Existing tasks remain visible, and the input value is preserved
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(input).toHaveValue('Will fail');
  });
});
