const express = require("express");
const { randomBytes } = require("crypto");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const post = {};

app.post("/posts", (req, res) => {
  const id = randomBytes(3).toString("hex");
  const { title } = req.body;
  post[id] = { id, title };
  res.send(post[id]).status(201);
});

app.get("/posts", (req, res) => {
  res.status(200).send(post);
});

app.listen(4000, () => {
  console.log("App is listening on 4000");
});
