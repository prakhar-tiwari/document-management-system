const CustomError = require("../errors/custom-error");

module.exports = (err, req, res, next) => {
  try {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ msg: err.message });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
};
