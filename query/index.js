const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

app.get("/posts", async (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "postCreation") {
    const { id, title } = data;
    posts[id] = { id, data, comments: [] };
  } else if (type === "commentCreation") {
    const { id, postId, content } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }
  res.send({});
});

app.listen(4002, () => {
  console.log("App is listening on 4002");
});
