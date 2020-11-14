const User = require("../src/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { name, userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (user) {
      throw new Error("User already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name,
      userName,
      password: hashedPassword,
    });

    return res.status(201).json({ msg: "Signed in successfully" });
  } catch (err) {
    throw new Error(err);
  }
};

const login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      throw new Error("Incorrect username password combination");
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect username password combination");
    }

    const payload = {
      name: user.name,
      userName: user.userName,
    };

    jwt.sign(payload, "secret", { expiresIn: 7200 }, (err, token) => {
      if (err) {
        throw new Error(err);
      }
      return res.status(200).json({ token });
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { signup, login };
