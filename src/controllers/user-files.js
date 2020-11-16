const fs = require("fs");
const path = require("path");
const util = require("util");
const NotFoundError = require("../errors/not-found-error");
const User = require("../models/User");
const Document = require("../models/Document");
const mongoose = require("mongoose");

const createDirectory = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const getAllFiles = async (req, res, next) => {
  const { userName } = req.user;
  const user = await User.findOne({ userName });
  const { documents } = user;

  const docs = await Document.find({ _id: { $in: documents } });
  const folderNames = [];
  const fileNames = [];
  for (let item of docs) {
    const folder = path.relative(path.dirname(__dirname), item.folderPath);
    if (folder !== "documents") {
      const folderName = path.relative(
        path.dirname(item.folderPath),
        item.folderPath
      );
      folderNames.push(folderName);
    } else {
      fileNames.push(item.fileName);
    }
  }

  const allDocuments = {
    folderNames,
    fileNames,
  };

  return res.status(200).json(allDocuments);
};

const createFile = async (req, res, next) => {
  const { folderName, fileName } = req.body;
  const { folderPath, filePath } = await createNewFile(folderName, fileName);
  const fileNameSaved = path.basename(filePath);
  const document = await Document.create({
    fileName: fileNameSaved,
    folderPath: folderPath,
  });
  const { userName } = req.user;
  const user = await User.findOne({ userName });

  user.documents.push(mongoose.Types.ObjectId(document._id));
  await user.save();

  return res.status(201).json({ msg: "File created succesfully" });
};

const checkDirectoryExistence = (filePath) => {
  var dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  return false;
};

const createNewFile = async (folderName, fileName) => {
  const parent = path.resolve(__dirname, ".."); // get parent folder path
  const destination = path.join(parent, "documents");
  let folderPath = "";
  if (folderName) {
    folderPath = path.join(destination, folderName);
    if (checkDirectoryExistence(folderPath)) {
      await createDirectory(folderPath, { recursive: true });
    }
  } else {
    folderPath = destination;
  }
  const filePath = path.join(folderPath, fileName + ".txt");
  await writeFile(filePath, "");
  return { folderPath, filePath };
};

module.exports = { getAllFiles, createFile };
