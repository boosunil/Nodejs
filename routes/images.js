const express = require("express");
const router = express.Router();
const Image = require("../models/images");
const multer = require("multer");
const checkauth = require("../middleware/check-auth");
var path = require("path");

//for storing of image with some custom changes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Posting the image
router.post(
  "/post",
  checkauth,
  upload.single("productImage"),
  (req, res, next) => {
    const image = new Image({
      productImage: req.file.path,
    });
    image
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

//Getting the image which is the only field
router.get("/get", (req, res, next) => {
  Image.find()
    .select("_id productImage")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
