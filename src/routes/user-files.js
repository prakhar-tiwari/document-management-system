const express = require("express");
const { getAllFiles } = require("../controllers/user-files");
const isAuth = require("../middlewares/is-auth");
const filesRouter = express.Router();

filesRouter.get("/api/getfiles", isAuth, getAllFiles);

module.exports = { filesRouter };
