// /routes/authRoutes.js
const express = require("express");
const User = require("../models/userModels");
const UserZodSchema = require("../validation/userValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const router = express.Router();

//Middleware to check for the user identifcation
async function userIdentification(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //check if the user with this username and password exists or not ?

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    //match the password
    console.log(existingUser);
    const hashedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log(hashedPassword);
    if (!hashedPassword) {
      res.status(400).json({
        msg: "Invalid password. Please try again.",
      });
    }

    next();
  } else {
    res.json({
      msg: "User is not found, Signup to continue",
    });
  }
}

// Signup route
router.post("/signup", async (req, res) => {
  const userDetails = req.body;
  const verfiedUserDetails = UserZodSchema.safeParse(userDetails);

  if (!verfiedUserDetails.success) {
    const errors = verfiedUserDetails.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).send({
      error: "Validation failed",
      details: errors,
      message: errors.map((err) => `${err.path}: ${err.message}`).join("; "),
    });
  }

  try {
    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      return res
        .status(409)
        .send({ error: "User already exists, please log in" });
    }

    const user = new User(userDetails);
    await user.save();
    res.status(201).send({ message: "User saved successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const mongooseErrors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));
      return res.status(400).send({
        error: "Database validation failed",
        details: mongooseErrors,
        message: mongooseErrors
          .map((err) => `${err.path}: ${err.message}`)
          .join("; "),
      });
    }
    res.status(500).send({ error: "Internal server error" });
  }
});

//signin
router.post("/signin", userIdentification, function (req, res) {
  const email = req.body.email;
  const token = jwt.sign({ email: email }, jwtPassword);
  return res.json({
    token,
  });
});

module.exports = router;
