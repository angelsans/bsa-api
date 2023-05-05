const swaggerJSDoc = require("swagger-jsdoc");
const config = require("../config");
const { join } = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Swagger for BSA API Interview",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/api/v1`,
      description: `Api v1 ${config.env} server`,
    },
  ],
};

function getPath(path) {
  return join(process.cwd(), path);
}

function getPaths(paths) {
  return paths.map((p) => getPath(p));
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: getPaths(["./src/controllers/*/*.js"]),
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
