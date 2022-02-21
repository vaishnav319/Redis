const express = require("express");
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../../../../middleware/jwt_helper");
const router = express.Router();

const {
  registerUser,
  loginUser,
  dashboard,
  newToken,
  logout,
} = require("../../controllers/authentication/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", verifyAccessToken, dashboard);
router.post("/token", verifyRefreshToken, newToken);
router.get("/logout", verifyAccessToken, logout);
module.exports = router;
