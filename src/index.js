const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "my-first-db",
  password: "HfwTHbIwj1b4D7YkMK",
  port: 5432,
});

pool.query("SELECT NOW()", (error, response) => {
  if (error) {
    console.log("Error al conectarse a la base de datos", error);
  } else {
    console.log("Conectado a la base de datos", response.rows[0]);
  }
});

let tasks = [
  { id: 1, description: "Aprender Node.js", completed: false },
  { id: 2, description: "Practicar Express", completed: false },
];

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/tasks", (request, response) => {
  response.json({ tasks });
});

app.post("/tasks", async (request, response) => {
  try {
    const newTaskBody = {
      description: request.body.description,
      status: request.body.status || false,
    };

    const result = await pool.query(
      "INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING *",
      [newTaskBody.description, newTaskBody.status]
    );
    response.status(201).json(result.rows[0]);
    console.log("Tarea creada correctamente");
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error al crear la tarea" });
  }
});

app.put("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return response.status(404).json({ error: "Tarea no encontrada" });
  }
  if (request.body.description)
    tasks[taskIndex].description = request.body.description;
  if (request.body.completed)
    tasks[taskIndex].completed = request.body.completed;
  response.status(200).json(tasks[taskIndex]);
});

app.delete("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  response.status(200).json({ tasks, message: "Tarea eliminada" });
});

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
