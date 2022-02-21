const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const {
  JWT_ACCESS_KEY,
  JWT_ACCESS_TIME,
  JWT_REFRESH_KEY,
  JWT_REFRESH_TIME,
} = require("../core/config");
const res = require("express/lib/response");
let refreshTokens = [];
module.exports = {
  refreshTokens,
  removeRefreshToken: (userId) => {
    refreshTokens = refreshTokens.filter((user) => user.userId !== userId);
    console.log(refreshTokens);
  },
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: userId,
      };
      const secret = JWT_ACCESS_KEY;
      const options = {
        expiresIn: JWT_ACCESS_TIME,
        issuer: "Vaishnav",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.JWT_ACCESS_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      console.log(req.payload);
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: userId,
      };
      const secret = JWT_REFRESH_KEY;
      const options = {
        expiresIn: JWT_REFRESH_TIME,
        issuer: "Vaishnav",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },
  generateRefreshToken: (userId, refreshToken) => {
    let storedRefreshToken = refreshTokens.find((x) => x.userId === userId);
    console.log("in generate refresh token");
    if (storedRefreshToken === undefined) {
      //add it
      refreshTokens.push({
        userId: userId,
        token: refreshToken,
      });
    } else {
      //update it
      refreshTokens[refreshTokens.findIndex((x) => x.userId === userId)].token =
        refreshToken;
    }
    return refreshToken;
  },
  verifyRefreshToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const refreshToken = bearerToken[1];
    JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      let storedRefreshToken = refreshTokens.find(
        (x) => x.userId === payload.userId
      );
      if (storedRefreshToken === undefined) {
        return res.status(401).json({
          status: false,
          message: "Your session is invalid",
          data: "error",
        });
      }
      if (storedRefreshToken.token != refreshToken) {
        return res.status(401).json({
          status: false,
          message: "Your token is not same in store",
          data: "error",
        });
      }
      req.payload = payload;
      console.log("print payload");
      console.log(req.payload);
      next();
    });
  },
};

// verifyRefreshToken: (req, res, next) => {
//   if (!req.headers["authorization"]) return next(createError.Unauthorized());
//   const authHeader = req.headers["authorization"];
//   const bearerToken = authHeader.split(" ");
//   const refreshToken = bearerToken[1];
//   JWT.verify(refreshToken, process.env.JWT_ACCESS_KEY, (err, payload) => {
//     if (err) {
//       const message =
//         err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
//       return next(createError.Unauthorized(message));
//     }
//     let storedRefreshToken = refreshTokens.find(
//       (x) => x.userId === payload.userId
//     );
//     if (storedRefreshToken === undefined) {
//       return res.status(401).json({
//         status: false,
//         message: "Your session is invalid",
//         data: "error",
//       });
//     }
//     req.payload = payload;
//     console.log("print payload");
//     console.log(req.payload);
//     next();
//   });
// },
