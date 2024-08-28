const { postgresClient } = require("../dbs/connection-postgres");

const createNewTaskCtrl = async (request, response) => {
  try {
    const newTaskBody = {
      description: request.body.description,
      status: request.body.status || false,
      userId: request.body.userId || 1,
    };

    const result = await postgresClient.query(
      "INSERT INTO tasks (description, status, user_id) VALUES ($1, $2, $3) RETURNING *",
      [newTaskBody.description, newTaskBody.status, newTaskBody.userId]
    );
    response.status(201).json(result.rows[0]);
    console.log("Tarea creada correctamente");
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error al crear la tarea" });
  }
}

const getTaskCtrl = async (request, response) => {
  try {
    const taskId = parseInt(request.params.id);

    const queryTask = await postgresClient.query(
      `SELECT * FROM tasks WHERE id = ${taskId}`
    )
    response.json(queryTask.rows)
  } catch (error) {
    console.log(error)
  }
}

const updateTaskCtrl = async (request, response) => {
  const taskId = parseInt(request.params.id);

  const updateBody = {
    userId: request.body.userId,
  };

  const results = await postgresClient.query(
    "UPDATE tasks SET user_id = $1 WHERE id = $2 RETURNING *",
    [request.body.userId, taskId]
  );

  response.status(200).json(results.rows[0]);
}

const deleteTaskCtrl = async (request, response) => {
  const taskId = parseInt(request.params.id);

  if (isNaN(taskId) || taskId === 0 || !taskId) {
    return response
      .status(400)
      .json({ error: "El ID de la tarea no es válido" });
  }

  await postgresClient.query("DELETE FROM tasks WHERE id = $1", [taskId]);

  response.status(200).json({ message: "Tarea eliminada" });
}

const getAllTasksCtrl = async (request, response) => {
  const results = await postgresClient.query(
    "SELECT tasks.*, users.name FROM tasks JOIN users ON tasks.user_id = users.id ORDER BY tasks.id ASC"
  )
  response.json({ tasks: results.rows });
}


module.exports = {
  createNewTaskCtrl,
  getTaskCtrl,
  updateTaskCtrl,
  deleteTaskCtrl,
  getAllTasksCtrl
}