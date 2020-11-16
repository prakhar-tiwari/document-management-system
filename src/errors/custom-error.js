class CustomError extends Error {
  constructor({ statusCode, message}) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.name = "Custom Error"
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, CustomError);
  }
}

module.exports = CustomError;
