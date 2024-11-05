// Middlewares && zods

const express = require("express");
const zod = require("zod");

const port = 3004;
const app = express();

let noOfrequest = 0;

app.use(express.json());
app.listen(port);

//create schema for the user

const schema = zod.object({
  name: zod.string(),
  password: zod.string().min(2),
  country: zod.literal("IN").or(zod.literal("US")),
});

//middleware to count the number of requests
function countRequests(req, res, next) {
  noOfrequest++;
  console.log(noOfrequest);
  next();
}

app.get("/getfunc", countRequests, function (req, res) {
  res.send("hello");
});

app.post("/adduserdets", function (req, res) {
  const responsebody = req.body;
  const response = schema.safeParse(responsebody);
  console.log(response);
  console.log(responsebody);
  if (response.success) res.send("Added successfully");
  else {
    res.status(400).json({
      msg: "Wrong input",
    });
  }
});
