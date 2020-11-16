const CustomError = require("./custom-error");

class NotAuthorizedError extends CustomError {
  constructor(message = "Not Authorized") {
    super({
      message: message,
      statusCode: 402,
    });
  }
}

module.exports = NotAuthorizedError;
