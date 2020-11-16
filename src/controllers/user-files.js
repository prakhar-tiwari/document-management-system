const fs = require("fs");
const path = require("path");
const util = require("util");
const NotFoundError = require("../errors/not-found-error");

const createDirectory = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

const getAllFiles = async (req, res, next) => {
  const { user } = req;
  if (user) {
    throw new NotFoundError();
  }
  return res.status(200).json("file uploaded");
};

const createFile = async (req, res, next) => {
  const { folderName, fileName } = req.body;
  const res = await createNewFile(folderName, fileName);
  return res.status(200).json({ msg: "File created successfully" });
};

const checkDirectoryExistence = (filePath) => {
  var dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  return false;
};

const createNewFile = async (folderName, fileName) => {
  const parent = path.resolve(__dirname, "..");
  const destination = path.join(parent, "documents");
  let folderPath = "";
  if (folderName) {
    folderPath = path.join(destination, folderName);
    if (checkDirectoryExistence(folderPath)) {
      const _dir = await createDirectory(folderPath, { recursive: true });
    }
  } else {
    folderPath = destination;
  }

  const _createdFile = await writeFile(
    path.join(folderPath, fileName + ".txt"),
    ""
  );
  return folderPath;
};

module.exports = { getAllFiles, createFile };
