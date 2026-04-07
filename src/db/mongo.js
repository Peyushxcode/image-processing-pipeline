const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/imagePipelineDB");
  console.log("MongoDB connected");
}

module.exports = connectDB;