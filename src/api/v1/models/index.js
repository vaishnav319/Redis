const assert = require("assert");
const userModel = require("./userModel/user.model");

assert(userModel, "user model is required");

module.exports = {
  Users: userModel,
};
