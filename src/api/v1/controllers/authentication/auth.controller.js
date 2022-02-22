const express = require("express");
const router = express.Router();
var createError = require("http-errors");
var bcrypt = require("bcryptjs");
const { Users } = require("../../models/index");
const {
  signAccessToken,
  signRefreshToken,
  refreshTokens,
  generateRefreshToken,
  removeRefreshToken,
} = require("../../../../middleware/jwt_helper");

exports.registerUser = (req, res, next) => {
  let accessToken, refreshToken;
  Users.findOne({ email: req.body.email })
    .then(async (doc) => {
      if (!doc) {
        const salt = await bcrypt.genSalt(10);
        const HashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new Users({
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          password: HashedPassword,
        });
        accessToken = await signAccessToken(user.id, user.userType);
        refreshToken = await signRefreshToken(user.id);
        user
          .save()
          .then((data) => {
            res.status(200).json({
              statusCode: 200,
              message: "success",
              accessToken,
              refreshToken,
              data,
            });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        throw createError.Conflict("USER ALREADY EXISTS");
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.loginUser = (req, res, next) => {
  let accessToken, refreshToken;
  Users.findOne({ email: req.body.email })
    .then(async (doc) => {
      if (doc) {
        accessToken = await signAccessToken(doc.id);
        refreshToken = await signRefreshToken(doc.id);
        const isMatch = await bcrypt.compare(req.body.password, doc.password);
        if (!isMatch) {
          res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        console.log("almost done");
        res.status(200).json({
          statusCode: 200,
          message: "Login Successfull",
          accessToken,
          refreshToken,
          data: doc,
        });
      } else {
        throw createError.Conflict("USER NOT FOUND!");
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.dashboard = (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Hello from Dashboard",
  });
};

exports.newToken = async (req, res) => {
  console.log("in new tokrn route");
  console.log(req.payload);
  let accessToken, refreshToken;
  const userId = req.payload.userId;
  accessToken = await signAccessToken(userId);
  refreshToken = await signRefreshToken(userId);

  generateRefreshToken(userId, refreshToken);
  res.status(200).json({
    statusCode: 200,
    message: "Success",
    accessToken,
    refreshToken,
  });
};

exports.logout = async (req, res, next) => {
  let userId = req.payload.userId;
  console.log(userId);
  //remove refresh token
  console.log("before refresh", refreshTokens);
  removeRefreshToken(userId);

  res.status(200).json({
    statusCode: 200,
    message: "Logout Success",
  });
};
