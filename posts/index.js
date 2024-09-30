const express = require("express");
const { randomBytes } = require("crypto");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

const post = {};

app.post("/posts", async (req, res) => {
  const id = randomBytes(3).toString("hex");
  const { title } = req.body;
  post[id] = { id, title };
  await axios.post("http://localhost:4005/events", {
    type: "postCreation",
    data: {
      id,
      title,
    },
  });
  res.send(post[id]).status(201);
});

app.get("/posts", (req, res) => {
  res.status(200).send(post);
});

app.post("/events", (req, res) => {
  console.log("Received an Event: ", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("V2");
  console.log("App is listening on 4000");
});
