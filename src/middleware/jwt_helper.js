const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const {
  JWT_ACCESS_KEY,
  JWT_ACCESS_TIME,
  JWT_REFRESH_KEY,
  JWT_REFRESH_TIME,
} = require("../core/config");
const client = require("../core/cache/init_redis");
const res = require("express/lib/response");
let refreshTokens = [];
module.exports = {
  refreshTokens,
  removeRefreshToken: async (userId) => {
    client.del(userId.toSring());

    //blacklist current access token
    await client.set("BL_" + userId.toSring(), token);
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
        console.log("refresh token:", token);
        console.log(userId);
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        // client.get("2", async (err, data) => {
        //   if (data) {
        //     return res.status(200).send({
        //       error: false,
        //       message: `Data for 2 from the cache`,
        //       data: JSON.parse(data),
        //     });
        //   }
        // });

        client.GET(userId, (err, result) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          }
          console.log("in client sugn refresh");
          if (result) {
            resolve(result);
          } else {
            client.SET(
              userId,
              token,
              "EX",
              365 * 24 * 60 * 60,
              (err, reply) => {
                if (err) {
                  console.log(err.message);
                  reject(createError.InternalServerError());
                  return;
                }
                resolve(token);
                return;
              }
            );
          }
        });
      });
    });
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
      req.payload = payload;
      const userId = payload.userId;
      console.log(req.payload);
      client.GET(userId, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        if (result === null)
          return res
            .staus(401)
            .json({ status: false, message: "Invalid Request" });
        if (refreshToken !== JSON.parse(result).token)
          return res
            .staus(401)
            .json({ status: false, message: "Token is not same as in store" });

        if (refreshToken === JSON.parse(result).token) return resolve(userId);
        console.log("not matched");
      });

      next();
    });
  },
};
