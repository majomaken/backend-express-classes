require("dotenv").config({
  path: ".env",
});

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const { ROUTES } = require("./constants/routes.constants");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use(ROUTES.auth, authRoutes);
app.use(ROUTES.users, userRoutes);
app.use(ROUTES.tasks, taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
