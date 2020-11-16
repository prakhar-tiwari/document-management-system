const express = require("express");
const {
  getAllFiles,
  createFile,
  createFolder,
  getFilesByFolder,
} = require("../controllers/user-files");
const { isAuth } = require("../middlewares/is-auth");
const filesRouter = express.Router();

filesRouter.get("/api/getfiles", isAuth, getAllFiles);

filesRouter.post("/api/getfilesbyfolder", isAuth, getFilesByFolder);

filesRouter.post("/api/createfolder", isAuth, createFolder);

filesRouter.post("/api/createfile", isAuth, createFile);

module.exports = { filesRouter };
