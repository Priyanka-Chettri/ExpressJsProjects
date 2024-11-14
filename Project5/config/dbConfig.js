// /config/dbConfig.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://priyankachettri85:0oC2v0x07UW91mhs@interviewxlog.vkr03.mongodb.net/"
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
