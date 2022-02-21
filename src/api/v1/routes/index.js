const express = require("express");
const router = express.Router();

const AuthenticationRoute = require("./authentication/auth.route");

router.use("/auth", AuthenticationRoute);

module.exports = router;
