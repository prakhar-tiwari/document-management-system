const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const { token } = req.headers?.authorization;
    if (!token) {
      throw new Error("User not authorized");
    }

    const payload = jwt.verify(token, "secret");
    req.user = payload;
    next();
  } catch (err) {
    throw new Error(err);
  }
};
