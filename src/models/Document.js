const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  fileName: String,
  fileContent: Blob,
  folderPath: String,
});

module.exports = mongoose.model("User", documentSchema);
