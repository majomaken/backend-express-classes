const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 5000;

let tasks = [
  { id: 1, description: 'Aprender Node.js', completed: false },
  { id: 2, description: 'Practicar Express', completed: false },
];

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/tasks', (request, response) => {
  response.json({tasks});
});

app.post('/tasks', (request, response) => {
  
  const newTask = {
    id: tasks.length + 1,
    description: request.body.description,
    completed: request.body.completed || false
  }

  tasks.push(newTask);
  console.log(tasks);
  response.status(201).json({tasks});
});

app.put('/tasks/:id', (request, response) => {
  const taskId = parseInt(request.params.id)
  const taskIndex = tasks.findIndex(task => task.id === taskId)
  if (taskIndex === -1) {
    return response.status(404).json({ error: 'Tarea no encontrada' })
  }

  tasks[taskIndex].description = request.body.description
  response.status(200).json(tasks[taskIndex]);
})

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
})