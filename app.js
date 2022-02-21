const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));
app.use(express.json({ limit: "50mb" }));
//DB
const connectDB = require("./src/database/index");
connectDB();

//CORS SETTING
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

//Nodemon
require("./src/core/init_nodemon");
//Routes
const v1 = require("./src/api/v1/routes/index");
//Main Routes
app.use("/api/v1", v1);

//MIDDLEWARE
app.use((req, res, next) => {
  const error = new Error("Bad Request");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
