const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const posts = {};

const handleEvent = (type, data) => {
  console.log(`Processing event: ${type}`);

  if (type === "postCreation") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "commentCreation") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, content, status });
    } else {
      console.warn(`Post ${postId} not found for comment ${id}`);
    }
  } else if (type === "commentUpdation") {
    const { id, postId, content, status } = data;
    const post = posts[postId];
    if (post) {
      const comment = post.comments.find((comment) => comment.id === id);
      if (comment) {
        comment.status = status;
        comment.content = content;
      } else {
        console.warn(`Comment ${id} not found in post ${postId}`);
      }
    } else {
      console.warn(`Post ${postId} not found for comment update ${id}`);
    }
  } else {
    console.warn(`Unknown event type: ${type}`);
  }
};

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.status(200).send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("Query service listening on port 4002");

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");
    for (let event of res.data) {
      console.log("Processing stored event:", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
  }
});
