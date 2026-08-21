const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (description = 'Temp Task to Delete', dueDate) => {
  const response = await request(app)
    .post('/api/tasks')
    .send(dueDate !== undefined ? { description, due_date: dueDate } : { description })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('due_date');
      expect(task).toHaveProperty('created_at');
    });

    it('should sort tasks by created_at by default', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      const createdAtValues = response.body.map((task) => task.created_at);
      const sorted = [...createdAtValues].sort();
      expect(createdAtValues).toEqual(sorted);
    });

    it('should sort tasks by due_date and keep undated tasks visible', async () => {
      const withDueDate = await createTask('Task with due date', '2030-01-01');
      const withoutDueDate = await createTask('Task without due date');

      const response = await request(app).get('/api/tasks?sortBy=due_date');

      expect(response.status).toBe(200);
      const ids = response.body.map((task) => task.id);
      expect(ids).toContain(withDueDate.id);
      expect(ids).toContain(withoutDueDate.id);
      // Undated tasks sort after dated ones
      expect(ids.indexOf(withoutDueDate.id)).toBeGreaterThan(ids.indexOf(withDueDate.id));
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { description: 'Test Task' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe(newTask.description);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body.due_date).toBeNull();
    });

    it('should create a new task with a due date', async () => {
      const newTask = { description: 'Test Task With Due Date', due_date: '2030-05-01' };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.due_date).toBe(newTask.due_date);
    });

    it('should return 400 if description is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Task description is required');
    });

    it('should return 400 if description is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Task description is required');
    });

    it('should return 400 if due_date is invalid', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Bad due date', due_date: 'not-a-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Due date must be a valid date string');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task description', async () => {
      const task = await createTask('Original description');

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ description: 'Updated description' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated description');
      expect(response.body.id).toBe(task.id);
    });

    it('should update a task due date', async () => {
      const task = await createTask('Task to add due date to');

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ due_date: '2030-06-15' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.due_date).toBe('2030-06-15');
    });

    it('should clear a task due date', async () => {
      const task = await createTask('Task with due date to clear', '2030-01-01');

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ due_date: null })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.due_date).toBeNull();
    });

    it('should return 400 if description is blank', async () => {
      const task = await createTask('Task to blank out');

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ description: '   ' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Task description is required');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app)
        .put('/api/tasks/999999')
        .send({ description: 'Does not matter' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .put('/api/tasks/abc')
        .send({ description: 'Does not matter' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask('Task To Be Deleted');

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: task.id });

      const deleteAgain = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });
});