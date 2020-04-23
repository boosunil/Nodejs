const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const imageRoutes = require("./routes/images");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require("path");
const cors = require("cors");

app.use(cors());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes or endpoints
app.use("/", userRoutes);
app.use("/images", imageRoutes);
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname + "/uploads")));

//Database connection
mongoose.connect(
  "mongodb://localhost:27017/task",
  { useNewUrlParser: true, useUnifiedTopology: true },

  (error) => {
    if (!error) {
      console.log("Connection Successful");
    } else {
      console.log("Error connecting with db");
    }
  }
);

app.use((req, res, next) => {
  const error = new Error("Not Found");
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

app.listen(3000);
