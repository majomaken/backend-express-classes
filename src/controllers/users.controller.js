const { postgresClient } = require("../dbs/connection-postgres")

const getAllUsersCtrl = async (request, response) => {
  try {
    const queryUsers = await postgresClient.query(
      "SELECT * FROM users"
    )
    response.json(queryUsers.rows)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllUsersCtrl
}