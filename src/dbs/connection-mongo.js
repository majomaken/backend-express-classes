// Mongodb Connection
const { MongoClient } = require("mongodb");

const uri = "mongodb://root:Attractor3-Fretful-Yonder-Antiviral@localhost:27017/"
const mongoClient = new MongoClient(uri)

async function connectDb() {
  try {
      await mongoClient.connect();
      console.log('Conectado  a MongoDB!');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}

connectDb();

module.exports = {
  mongoClient,
}