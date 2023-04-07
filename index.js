const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// app.use(bodyParser.urlencoded({extended: true}));

// adding Helmet to enhance your Rest API's security
// app.use(helmet());
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
// enabling CORS for all requests
app.use(cors());
// adding morgan to log HTTP requests
app.use(morgan("combined"));

const port = process.env.PORT || 4000;

const usersRouter = require("./src/routes/UserRoute");
const postRouter = require("./src/routes/PostRoute");

const DB_URL =
  "mongodb+srv://niket97:DczNH03EXZo98JVQ@cluster0.nxti7uj.mongodb.net/?retryWrites=true&w=majority";

app.use("/api", usersRouter);
app.use("/api/blogs", postRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

mongoose
  .connect(DB_URL)
  .then((result) => {
    console.log("connected database");
  })
  .catch((error) => {
    console.log("error", error);
  });

app.listen(port, () => console.log(`Listening on localhost: ${port}`));
