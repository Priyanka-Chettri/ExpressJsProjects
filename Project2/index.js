const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;

app.use(bodyParser.json());
app.listen(port);

var users = [
  {
    name: "John",
    kidneys: {
      left: {
        healthy: false,
      },

      right: {
        healthy: true,
      },
    },
  },
];

console.log(users[0]);

app.get("/", (req, res) => {
  res.send(JSON.stringify(users));
});

app.get("/getkidneys", (req, res) => {
  const kidney = users[0].kidneys;
  const kidneyCount = Object.keys(kidney).length; //kideneys count
  console.log(kidney);
  console.log(kidneyCount);

  //health of each kidney
  let healthyKidney = 0;

  if (kidney.left.healthy) {
    healthyKidney += 1;
  }
  if (kidney.right.healthy) {
    healthyKidney += 1;
  }
  const UnhealthyKidney = kidneyCount - healthyKidney;

  res.json({
    kidneyCount,
    healthyKidney,
    UnhealthyKidney,
  });
});

app.post("/addkidney", (req, res) => {
  const body = req.body;
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === body.name) {
      const kidney = users[i].kidneys;

      users[i].kidneys = {
        ...kidney,
        middleKidney: {
          healthy: body.health,
        },
      };
    }
  }

  res.send("Added successfully");
});

app.put("/replacekidney", (req, res) => {
  const body = req.body;
  for (let i = 0; i < users.length; i++) {
    if (body.name === users[i].name) {
      const kidney = users[i].kidneys;

      users[i].kidneys = {
        ...kidney,
        [body.side]: body.replaceKidney,
      };
    }
  }
  res.send("DOne");
});

app.delete("/deletekidney", (req, res) => {
  const body = req.body;
  for (let i = 0; i < users.length; i++) {
    if (body.side === "left") {
      delete users[i].kidneys.left; // Delete the left kidney
    } else if (body.side === "right") {
      delete users[i].kidneys.right; // Delete the right kidney
    } else if (body.side === "middle") {
      delete users[i].kidneys.middleKidney;
    }
  }
  res.send("DOne");
});
