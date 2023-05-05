const badRequest = (message) => {
  throw {
    status: 400,
    message: message ?? "Bad Request",
  };
};

const notFound = (message) => {
  throw {
    status: 404,
    message: message ?? "Not Found",
  };
};

const serverError = (message) => {
  throw {
    status: 500,
    message: message ?? "Internal Server Error",
  };
};

module.exports = {
  badRequest,
  notFound,
  serverError,
};
