const config = {
  env: process.env.NODE_ENV || "development",
  server: {
    port: process.env.SERVER_PORT || 8000,
  },
  swagger: {
    route: process.env.SWAGGER_ROUTE || "/swagger",
  },
};

module.exports = config;
