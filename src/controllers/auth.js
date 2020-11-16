const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/bad-request");

const signup = async (req, res, next) => {
  const { name, userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (user) {
    throw new BadRequestError("User already exist");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    name,
    userName,
    password: hashedPassword,
  });

  return res.status(201).json({ msg: "Signed in successfully" });
};

const login = async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user) {
    throw new BadRequestError("Incorrect username password combination");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Incorrect username password combination");
  }

  const payload = {
    name: user.name,
    userName: user.userName,
  };

  jwt.sign(payload, "secret", { expiresIn: 7200 }, (err, token) => {
    if (err) {
      throw new BadRequestError(err.message);
    }
    return res.status(200).json({ token });
  });
};

module.exports = { signup, login };
