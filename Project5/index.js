//Project to connect to the database
//Template for signup

const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3003;
const jwtPassword = "123456";

app.listen(port);

//middleware to make body accessible to all the functions
app.use(express.json());

mongoose.connect(
  "mongodb+srv://priyankachettri85:0oC2v0x07UW91mhs@interviewxlog.vkr03.mongodb.net/"
);

//create a schema first
const { Schema } = mongoose;

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [5, "Name must be atleast 5 characters long "],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

UserSchema.pre("save", async function (next) {
  console.log("in pre");
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      console.log(this.password);
    } catch (e) {
      next(e);
    }
  }
  next();
});

//creating a model
const User = mongoose.model("Users", UserSchema);

//signup
app.post("/signup", async function (req, res) {
  const userDetails = req.body;

  const user = User({
    name: userDetails.name,
    email: userDetails.email,
    password: userDetails.password,
  });

  //check if the same user exists or not
  const existingUser = await User.findOne({ email: userDetails.email });

  if (existingUser) {
    res.send("User already exists, pelase log in");
  } else {
    user
      .save()
      .then(() => {
        res.send("User saved successfully");
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          // Check if there is a validation error for the 'password' field
          if (error.errors.password) {
            return res
              .status(400)
              .send({ error: error.errors.password.message });
          } else if (error.errors.email) {
            return res.status(400).send({ error: error.errors.email.message });
          } else if (error.errors.name) {
            return res.status(400).send({ error: error.errors.name.message });
          }
        }
      });
  }
});

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

//signin
app.post("/signin", userIdentification, function (req, res) {
  const email = req.body.email;
  const token = jwt.sign({ email: email }, jwtPassword);
  return res.json({
    token,
  });
});
