const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super({
      message: message,
      statusCode: 400,
    });
  }
}

module.exports = BadRequestError;
