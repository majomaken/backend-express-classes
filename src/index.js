const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const { postgresClient } = require("./dbs/connection-postgres");
const { mongoClient } = require("./dbs/connection-mongo");

const db = mongoClient.db('my-first-db');
const tasksCollection = db.collection('tasks');

// Middlewares
app.use(cors());
app.use(express.json());

// app.get("/tasks", async (request, response) => {
//   const results = await postgresClient.query(
//     "SELECT tasks.*, users.name FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY tasks.id ASC"
//   )
//   response.json({ tasks: results.rows });
// });

app.get("/tasks", async (__, response) => {
  try {
    const results = await postgresClient.query(
          "SELECT tasks.*, users.name FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY tasks.id ASC"
        )

    const postgresTasks = results.rows
    const mongoTasks = await tasksCollection.find().toArray()

    const formattedMongoTasks = mongoTasks.map(task => {
      return {
        id: task._id,
        description: task.description,
        status: task.status,
        userId: task.userId,
      }
    })

    const tasks = [...formattedMongoTasks, ...postgresTasks]

    response.status(200).json({ tasks });

  } catch (error) {
    console.error("Error al obtener las tareas: ", error);
    response.status(500).json({ error: "Error al obtener las tareas" });
  }
});

app.get("/users", async (request, response) => {
  try {
    const queryUsers = await postgresClient.query(
      "SELECT * FROM users"
    )
    response.json(queryUsers.rows)
  } catch (error) {
    console.log(error)
  }
})

// app.post("/tasks", async (request, response) => {
//   try {
//     const newTaskBody = {
//       description: request.body.description,
//       status: request.body.status || false,
//       userId: request.body.userId || 1,
//     };

//     const result = await postgresClient.query(
//       "INSERT INTO tasks (description, status, user_id) VALUES ($1, $2, $3) RETURNING *",
//       [newTaskBody.description, newTaskBody.status, newTaskBody.userId]
//     );
//     response.status(201).json(result.rows[0]);
//     console.log("Tarea creada correctamente");
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({ error: "Error al crear la tarea" });
//   }
// });

app.post("/tasks", async (request, response) => {
  try {
    const newTaskBody = {
      description: request.body.description,
      status: request.body.status || false,
      userId: request.body.userId || 1,
    };

    const result = await tasksCollection.insertOne(newTaskBody)
    console.log("Log de result:", result)
    response.status(201).json({
      message: `Tarea creada correctamente con el id ${result.insertedId}`,
      id: result.insertedId
    });
  } catch (error) {
    console.error("Error creating task: ", error);
    response.status(500).json({ error: "Error al crear la tarea" });
  }
})

// app.put("/tasks/:id", async (request, response) => {
//   const taskId = parseInt(request.params.id);

//   // const updateBody = {
//   //   userId: request.body.userId,
//   // }

//   const results = await postgresClient.query(
//     "UPDATE tasks SET user_id = $1 WHERE id = $2 RETURNING *",
//     [request.body.userId, taskId]
//   )

//   response.status(200).json(results.rows[0]);
// });

app.put("/tasks/:id", async (request, response) => {
  try {
    const taskId = request.params.id;

  const updateBody = {
    userId: request.body.userId,
    description: request.body.description,
  }
  console.log('updateBody', updateBody)
  console.log('taskId', taskId)

  const results = await tasksCollection.updateOne({ _id: taskId }, { $set: request.body })
  console.log("Log de results:", results)
  response.status(200).json({results});
  } catch (error) {
    console.error("Error updating task: ", error);
    response.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

app.delete("/tasks/:id", async (request, response) => {
  const taskId = parseInt(request.params.id);

  if (isNaN(taskId) || taskId === 0 || !taskId) {
    return response.status(400).json({ error: "El ID de la tarea no es válido" });
  }

  await postgresClient.query("DELETE FROM tasks WHERE id = $1", [taskId]);

  response.status(200).json({ message: "Tarea eliminada" });
});

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
