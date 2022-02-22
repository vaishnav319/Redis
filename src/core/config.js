"use strict";
const dotenv = require("dotenv");
const assert = require("assert");
dotenv.config();

const {
  PORT,
  REDIS_PORT,
  REDIS_HOST,
  MONGO_DB_PW,
  MONGO_IAM,
  MONGO_DB,
  JWT_ACCESS_KEY,
  JWT_ACCESS_TIME,
  JWT_REFRESH_KEY,
  JWT_REFRESH_TIME,
} = process.env;

assert(MONGO_DB_PW, "MongoDB Password is required");
assert(MONGO_IAM, "Mongodb User is required");
assert(MONGO_DB, "MongoDB String is required");
assert(PORT, "Server Port is required");
assert(JWT_ACCESS_TIME, " JWT_ACCESS_TIME is required");
assert(JWT_REFRESH_KEY, "Server JWT_REFRESH_KEY is required");
assert(JWT_REFRESH_TIME, "Server JWT_REFRESH_TIME is required");
assert(REDIS_PORT, "Redis port is required");
assert(REDIS_HOST, "redis host is required");
assert(JWT_ACCESS_KEY, "JWT_ACCESS_KEY is required");
module.exports = {
  port: PORT,
  mongoPw: MONGO_DB_PW,
  mongoIAM: MONGO_IAM,
  mongoDb: MONGO_DB,
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
  JWT_ACCESS_TIME: JWT_ACCESS_TIME,
  JWT_ACCESS_KEY: JWT_ACCESS_KEY,
  JWT_REFRESH_KEY: JWT_REFRESH_KEY,
  JWT_REFRESH_TIME: JWT_REFRESH_TIME,
};
