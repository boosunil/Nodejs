const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  productImage: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
