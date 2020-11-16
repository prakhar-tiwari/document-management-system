const jwt = require("jsonwebtoken");
const NotAuthorizedError = require("../errors/not-authorized-error");
const isAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new NotAuthorizedError("User not authorized");
    }
    const payload = jwt.verify(token, "secret");
    req.user = payload;
    next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { isAuth };
