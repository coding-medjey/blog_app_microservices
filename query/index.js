const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "postCreation") {
    const { id, title } = data;
    posts[id] = { id, data, comments: [] };
  } else if (type === "commentCreation") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  } else if (type === "commentUpdation") {
    const { id, postId, content, status } = data;
    console.log(data);
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", async (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("App is listening on 4002");

  const res = await axios.get("http://localhost:4005/events");
  res.data.forEach((event) => {
    console.log("Processing Event: ", event.type);
    handleEvent(event.type, event.data);
  });
});
