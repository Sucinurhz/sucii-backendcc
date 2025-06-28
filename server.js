const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Data dummy (Array di memory)
let nextId = 3; // Karena ada 2 data awal

let todos = [
  {
    id: 1,
    title: "Belajar Cloud Computing",
    description: "Mengerjakan tugas besar komputasi awan",
    completed: false,
    dueDate: "2025-06-25",
    createdAt: "2025-06-16T13:00:00Z"
  },
  {
    id: 2,
    title: "Submit Laporan",
    description: "Mengumpulkan laporan akhir ke dosen",
    completed: true,
    dueDate: "2025-06-20",
    createdAt: "2025-06-15T09:30:00Z"
  }
];

// Format response sukses
function successResponse(message, data) {
  return {
    status: "success",
    message,
    data
  };
}

// Format response error
function errorResponse(message) {
  return {
    status: "error",
    message
  };
}

// GET /api/todos - Ambil semua to-do
app.get('/api/todos', (req, res) => {
  res.json(successResponse('Data retrieved successfully', todos));
});

// POST /api/todos - Tambah to-do baru
app.post('/api/todos', (req, res) => {
  const { title, description, completed, dueDate } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json(errorResponse('Title, description, dan dueDate wajib diisi'));
  }

  const newTodo = {
    id: nextId++,
    title,
    description,
    completed: completed || false,
    dueDate,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  res.status(201).json(successResponse('To-do created successfully', newTodo));
});

// GET /api/todos/:id - Ambil detail to-do
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }

  res.json(successResponse('Data retrieved successfully', todo));
});

// PUT /api/todos/:id - Update to-do
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }

  const { title, description, completed, dueDate } = req.body;
  const updatedTodo = { ...todos[todoIndex] };

  if (title !== undefined) updatedTodo.title = title;
  if (description !== undefined) updatedTodo.description = description;
  if (completed !== undefined) updatedTodo.completed = completed;
  if (dueDate !== undefined) updatedTodo.dueDate = dueDate;

  todos[todoIndex] = updatedTodo;
  res.json(successResponse('To-do updated successfully', updatedTodo));
});

// DELETE /api/todos/:id - Hapus to-do
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json(successResponse('To-do deleted successfully', deletedTodo));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});