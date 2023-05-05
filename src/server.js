const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");
const config = require("./config");
const swaggerSpec = require("./middlewares/swagger.middleware");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(config.swagger.route, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(errorMiddleware);

module.exports = app;
