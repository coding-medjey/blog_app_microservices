const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

const comments = {};

app.use(express.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(comments[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(3).toString("hex");
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ error: "Content is required" });
  }

  const postComments = comments[req.params.id] || [];
  const newComment = { id: commentId, content, status: "pending" };
  postComments.push(newComment);
  comments[req.params.id] = postComments;

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "commentCreation",
      data: {
        id: commentId,
        postId: req.params.id,
        content: content,
        status: "pending",
      },
    });
    res.status(201).send(newComment);
  } catch (error) {
    console.error("Error sending event:", error);
    res.status(500).send({ error: "Failed to create comment" });
  }
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "commentModeration") {
    const postComments = comments[data.postId];
    if (postComments) {
      const comment = postComments.find((comment) => comment.id === data.id);
      if (comment) {
        comment.status = data.status;
        try {
          await axios.post("http://event-bus-srv:4005/events", {
            type: "commentUpdation",
            data: data,
          });
        } catch (error) {
          console.error("Error sending event:", error);
        }
      }
    }
  }

  console.log("Processing Event: ", type);
  res.status(200).send({});
});

app.listen(4001, () => {
  console.log(`Comments service listening on port 4001`);
});
