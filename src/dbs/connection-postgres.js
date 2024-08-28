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

const postgresClient = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

postgresClient.query("SELECT NOW()", (error, response) => {
  if (error) {
    console.log("Error al conectarse a la base de datos", error);
  } else {
    console.log("Conectado a la base de datos", response.rows[0]);
  }
});

module.exports = {
  postgresClient,
}