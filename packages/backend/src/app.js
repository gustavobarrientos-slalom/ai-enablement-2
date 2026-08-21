const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data
const initialTasks = [
  { description: 'Task 1', due_date: null },
  { description: 'Task 2', due_date: null },
  { description: 'Task 3', due_date: null },
];
const insertStmt = db.prepare('INSERT INTO tasks (description, due_date) VALUES (?, ?)');

initialTasks.forEach(task => {
  insertStmt.run(task.description, task.due_date);
});

console.log('In-memory database initialized with sample data');

// Matches YYYY-MM-DD or a full ISO 8601 timestamp
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
const isValidDueDate = (value) => typeof value === 'string' && DATE_FORMAT.test(value) && !isNaN(Date.parse(value));

const SORTABLE_COLUMNS = {
  created_at: 'created_at',
  due_date: 'due_date',
};

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.get('/api/tasks', (req, res) => {
  try {
    const { sortBy } = req.query;
    const column = SORTABLE_COLUMNS[sortBy] || SORTABLE_COLUMNS.created_at;
    // Nulls last regardless of column, so undated tasks stay visible
    const tasks = db
      .prepare(`SELECT * FROM tasks ORDER BY ${column} IS NULL, ${column} ASC`)
      .all();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { description, due_date: dueDate } = req.body;

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ error: 'Task description is required' });
    }

    if (dueDate !== undefined && dueDate !== null && !isValidDueDate(dueDate)) {
      return res.status(400).json({ error: 'Due date must be a valid date string' });
    }

    const result = insertStmt.run(description, dueDate ?? null);
    const id = result.lastInsertRowid;

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { description, due_date: dueDate } = req.body;

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
      return res.status(400).json({ error: 'Task description is required' });
    }

    if (dueDate !== undefined && dueDate !== null && !isValidDueDate(dueDate)) {
      return res.status(400).json({ error: 'Due date must be a valid date string' });
    }

    const nextDescription = description !== undefined ? description : existingTask.description;
    const nextDueDate = dueDate !== undefined ? dueDate : existingTask.due_date;

    db.prepare('UPDATE tasks SET description = ?, due_date = ? WHERE id = ?').run(
      nextDescription,
      nextDueDate,
      id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db, insertStmt };