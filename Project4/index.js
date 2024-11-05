const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();
const port = 3005;

app.use(express.json());
app.listen(port);

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "priyanka@gmail.com",
    password: "256",
    name: "priyanka kapoor",
  },
  {
    username: "roktimt@gmail.com",
    password: "789",
    name: "roktim senapoty",
  },
];

//let's define a middeleware that checks if the user exists or not

function userIdentification(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  //check if the user with this username and password exists or not ?

  const user = ALL_USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    next();
  } else {
    res.json({
      msg: "User is not found, Signup to continue",
    });
  }
}

//Function to sign in if the user exists the then return the token else return the message user doesnt exists

app.post("/signin", userIdentification, function (req, res) {
  const username = req.body.username;

  const token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

//Function to see if requests is coming from the same user

app.get("/users", function (req, res) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    res.json({ msg: `Welcome ${username}` });
  } catch (e) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});
