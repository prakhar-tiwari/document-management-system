const express = require("express");
const { getAllFiles, createFile } = require("../controllers/user-files");
const { isAuth } = require("../middlewares/is-auth");
const filesRouter = express.Router();

filesRouter.get("/api/getfiles", isAuth, getAllFiles);

filesRouter.post("/api/createfile", createFile);

module.exports = { filesRouter };
