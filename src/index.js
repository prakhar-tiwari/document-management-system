const app = require("./app");
const mongoose = require("mongoose");
const keys = require("./config/key");

const PORT = process.env.NODE_ENV || 5000;

mongoose
  .connect(keys.MONGO_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDb connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
