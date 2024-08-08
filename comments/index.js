const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const comments = [];

app.use(express.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.send(comments[req.params.id] || []).status(200);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(3).toString("hex");
  const { content } = req.body;
  const comment = comments[req.params.id] || [];
  const newComment = { id: commentId, content };
  comment.push(newComment);
  comments[req.params.id] = comment;
  await axios.post("http://localhost:4005/events", {
    type: "commentCreation",
    data: {
      id: commentId,
      postId: req.params.id,
      content: content,
    },
  });
  res.send(newComment).status(200);
});

app.post("/events", (req, res) => {
  console.log("Received an Event: ", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log("APP is Listening in 4001");
});
