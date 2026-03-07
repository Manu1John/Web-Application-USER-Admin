const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect("mongodb://localhost:27017/registerForm")
    .then(() => console.log("database connection established"))
    .catch(() => console.log("connection failed"));
};

module.exports = connectDB;