# Functional Requirements

This document defines the core functional requirements for the TODO application.

## Task Management

- **FR-001: Create a task**
  - The user can create a new task.
  - A task must include a task description or title.
  - Newly created tasks record the date and time they were added.

- **FR-002: Add a due date**
  - The user can add a due date to a task when creating it or afterward.
  - The user can leave the due date unset when a task does not have a deadline.

- **FR-003: Edit a task**
  - The user can edit an existing task's description or title.
  - The user can add, change, or remove an existing task's due date.
  - Saving an edit updates the existing task rather than creating a duplicate task.

- **FR-004: Delete a task**
  - The user can delete an existing task.
  - The application removes the task from the active task list after deletion.

## Task Sorting

- **FR-005: Sort tasks by date added**
  - The user can sort tasks by the date and time they were added.
  - The application displays tasks in a consistent order based on that value.

- **FR-006: Sort tasks by due date**
  - The user can sort tasks by due date.
  - Tasks without a due date remain visible when sorting by due date.
  - The application displays tasks in a consistent order based on the due date.
