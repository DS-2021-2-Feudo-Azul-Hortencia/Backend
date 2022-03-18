const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:admin@mongo-db:27017/travel?authSource=admin";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo was connect");
  })
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });
