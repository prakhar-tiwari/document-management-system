const CustomError = require("./custom-error");

class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super({
      message: message,
      statusCode: 500,
    });
  }
}

module.exports = InternalServerError;
