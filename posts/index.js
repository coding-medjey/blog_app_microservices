const express = require("express");
const { randomBytes } = require("crypto");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

const posts = {};

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(3).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "postCreation",
      data: {
        id,
        title,
      },
    });
    console.log("Successfully sent the request");
    res.status(201).send(posts[id]);
  } catch (error) {
    console.error("Error sending event:", error);
    res.status(500).send({ error: "Error creating post" });
  }
});

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  console.log("Received an Event:", req.body.type);
  res.status(200).send({});
});

app.listen(4000, () => {
  console.log("V2");
  console.log("App is listening on 4000");
});
