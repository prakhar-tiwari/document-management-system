const CustomError = require("./custom-error");

class NotFoundError extends CustomError {
  constructor(message = "Not Found Error") {
    super({
      message: message,
      statusCode: 404,
    });
  }
}

module.exports = NotFoundError;
