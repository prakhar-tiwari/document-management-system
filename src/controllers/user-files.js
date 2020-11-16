const NotFoundError = require("../errors/not-found-error");
const getAllFiles = async (req, res, next) => {
  const { user } = req;
  if (user) {
    throw new NotFoundError();
  }
};

module.exports = { getAllFiles };
