require("dotenv").config();
const config = require("./src/config");
const server = require("./src/server");
const db = require("./src/db");
const seetData = require("./src/seeds/seed");

(async function () {
  try {
    await db.connect();
    await seetData();
    const port = config.server.port;
    server.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
})();
