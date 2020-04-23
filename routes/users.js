const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const checkauth = require("../middleware/check-auth");

var jsonParser = bodyParser.json();

//Registering the New User
router.post("/signup", jsonParser, (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "User Created",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

//Get the Users Details
router.get("/signup", checkauth, (req, res) => {
  User.find()
    .select("_id email ")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    });
});

//Check if he registered then allow him to login
router.post("/login", jsonParser, (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              id: user[0]._id,
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Successfully Login",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    });
});
module.exports = router;
