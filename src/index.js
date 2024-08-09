const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const { Pool } = require("pg");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  "postgres://postgres:HfwTHbIwj1b4D7YkMK@localhost:5432/my-first-db"
)

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDb();

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


// Middlewares
app.use(cors());
app.use(express.json());

app.get("/tasks", async (request, response) => {
  const results = await pool.query(
    "SELECT tasks.*, users.name FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY tasks.id ASC"
  )
  response.json({ tasks: results.rows });
});

app.get("/users", async (request, response) => {
  try {
    const queryUsers = await pool.query(
      "SELECT * FROM users"
    )
    response.json(queryUsers.rows)
  } catch (error) {
    console.log(error)
  }
})

app.post("/tasks", async (request, response) => {
  try {
    const newTaskBody = {
      description: request.body.description,
      status: request.body.status || false,
      userId: request.body.userId || 1,
    };

    const result = await pool.query(
      "INSERT INTO tasks (description, status, user_id) VALUES ($1, $2, $3) RETURNING *",
      [newTaskBody.description, newTaskBody.status, newTaskBody.userId]
    );
    response.status(201).json(result.rows[0]);
    console.log("Tarea creada correctamente");
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error al crear la tarea" });
  }
});

app.put("/tasks/:id", async (request, response) => {
  const taskId = parseInt(request.params.id);

  // const updateBody = {
  //   userId: request.body.userId,
  // }

  const results = await pool.query(
    "UPDATE tasks SET user_id = $1 WHERE id = $2 RETURNING *",
    [request.body.userId, taskId]
  )

  response.status(200).json(results.rows[0]);
});

app.delete("/tasks/:id", async (request, response) => {
  const taskId = parseInt(request.params.id);

  if (isNaN(taskId) || taskId === 0 || !taskId) {
    return response.status(400).json({ error: "El ID de la tarea no es válido" });
  }

  await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);

  response.status(200).json({ message: "Tarea eliminada" });
});

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
