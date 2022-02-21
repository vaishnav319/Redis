const mongoose = require("mongoose");
const { mongoPw, mongoIAM, mongoDb } = require("../core/config");

const dotenv = require("dotenv");

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(mongoIAM + mongoPw + mongoDb);

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
