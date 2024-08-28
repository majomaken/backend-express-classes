const { postgresClient } = require("../dbs/connection-postgres");

const createUserCtrl = async (req, response) => {
  try {
    console.log(req.body);
    const queryUsers = await postgresClient.query(
      "SELECT a FROM users"
    )
    response.json(queryUsers.rows)
  } catch (error) {
    console.log(error);
    response.status(500).json({ errorMessage: 'No se pudo crear el usuario' });
  }
}

module.exports = {
  createUserCtrl
}