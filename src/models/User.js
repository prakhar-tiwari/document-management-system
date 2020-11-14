const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  userName: String,
  password: String,
  documents: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Document",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
