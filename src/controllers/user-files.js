const fs = require("fs");
const path = require("path");
const util = require("util");
const NotFoundError = require("../errors/not-found-error");
const User = require("../models/User");
const Document = require("../models/Document");
const mongoose = require("mongoose");

const createDirectory = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const renameFile = util.promisify(fs.rename);

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

const getFilesByFolder = async (req, res, next) => {
  const { folderName } = req.body;
  const parent = path.resolve(__dirname, ".."); // get parent folder path
  const destination = path.join(parent, "documents");
  const folderPath = path.join(destination, folderName);
  const { userName } = req.user;

  const result = await Document.aggregate([
    {
      $match: {
        folderPath: folderPath,
      },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$user" },
        pipeline: [
          getMatchObj("$_id", "$$userId"),
          getMatchObj("$userName", userName),
        ],
        as: "user_docs",
      },
    },
    {
      $unwind: "$user_docs",
    },
    {
      $project: {
        fileName: 1,
        folderPath: 1,
      },
    },
  ]);
  return res.status(200).json(result);
};

const createFolder = async (req, res, next) => {
  const { folderName } = req.body;
  const folder = await createNewFolder(folderName);

  const { userName } = req.user;
  const user = await User.findOne({ userName });

  const document = await Document.create({
    folderPath: folder,
    user: user._id,
  });

  user.documents.push(mongoose.Types.ObjectId(document._id));
  await user.save();
  return res.status(201).json({ msg: "Folder created successfully" });
};

const createNewFolder = async (folderName) => {
  const root = path.dirname(__dirname);
  const folder = path.join(root, folderName);
  await createDirectory(folder);
  return folder;
};

const createFile = async (req, res, next) => {
  const { folderName, fileName } = req.body;
  const { folderPath, filePath } = await createNewFile(folderName, fileName);
  const fileNameSaved = path.basename(filePath);

  const { userName } = req.user;
  const user = await User.findOne({ userName });

  const document = await Document.create({
    fileName: fileNameSaved,
    folderPath: folderPath,
    user: user._id,
  });

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

const moveFile = async (req, res, next) => {
  const { oldFolderPath, newFolderPath, fileName, _id } = req.body;
  if (
    checkDirectoryExistence(oldFolderPath) &&
    checkDirectoryExistence(newFolderPath)
  ) {
    const oldFilePath = path.join(oldFolderPath, fileName);
    const newFilePath = path.join(newFolderPath, fileName);
    try {
      await renameFile(oldFilePath, newFilePath);
      const document = await Document.findOne({ _id });
      document.folderPath = newFolderPath;
      await document.save();
    } catch (err) {
      console.log(err);
    }
  }

  return res.status(201).json({ msg: "File move succesfully" });
};

function getMatchObj(first, second) {
  return {
    $match: {
      $expr: {
        $eq: [first, second],
      },
    },
  };
}

module.exports = {
  getAllFiles,
  createFile,
  createFolder,
  getFilesByFolder,
  moveFile,
};
