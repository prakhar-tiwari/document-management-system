const express = require("express");
const attachResponder = require("./middlewares/attach-responder");
const errorHandler = require("./middlewares/error-handler");
const { authRouter } = require("./routes/auth");

const app = express();

app.use(express.json());

app.use(attachResponder);

app.use(authRouter);

app.use(errorHandler);

module.exports = app;
