const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  originalPath: String,
  processedPaths: {
    thumbnail: String,
    medium: String,
    large: String
  },
  status: String
});

module.exports = mongoose.model("Image", imageSchema);