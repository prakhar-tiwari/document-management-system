const express = require("express");
const { login, signup } = require("../controllers/auth");
const authRouter = express.Router();

authRouter.post("/api/login", login);

authRouter.post("/api/signup", signup);

module.exports = { authRouter };
