const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

async function connect() {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, options);
}

async function disconnect() {
  await mongoose.connection.close();
}

module.exports = {
  connect,
  disconnect,
};
