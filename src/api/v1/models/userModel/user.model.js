const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Users", userSchema);
