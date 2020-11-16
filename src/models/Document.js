const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  fileName: String,
  fileContent: {
    data: Buffer,
    contentType: String,
  },
  folderPath: String,
});

module.exports = mongoose.model("Document", documentSchema);
