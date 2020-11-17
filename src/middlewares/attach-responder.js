const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found-error");
const NotAuthorizedError = require("../errors/not-authorized-error");
const InternalServerError = require("../errors/internal-server-error");

function attachResponder(req, res, next) {
  res.respond = createResponder(req, res, next);
  next();
}

function createResponder(req, res, next) {
  const responder = {
    _forwardError(error, ErrorClass = Error, data) {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorToForward = new ErrorClass(errorMessage, data);
      // forwards error to an error handler middleware
      next(errorToForward);
    },

    badRequest(error, data) {
      return responder._forwardError(error, BadRequestError, data);
    },
    notFound(error, data) {
      return responder._forwardError(error, NotFoundError, data);
    },
    notAuthorized(error, data) {
      return responder._forwardError(error, NotAuthorizedError, data);
    },
    internalServerError(error, data) {
      return responder._forwardError(error, InternalServerError, data);
    },
  };

  return responder;
}

module.exports = attachResponder;
