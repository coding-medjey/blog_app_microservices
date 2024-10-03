const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  // Basic validation
  if (!event || !event.type) {
    return res
      .status(400)
      .send({ status: "Error", message: "Invalid event structure" });
  }

  events.push(event);
  console.log("Processing Event: ", event.type);

  const services = [
    "http://posts-clusterip-srv:4000/events",
    "http://comments-srv:4001/events",
    "http://query-srv:4002/events",
    "http://moderation-srv:4003/events",
  ];

  try {
    await Promise.all(services.map((service) => axios.post(service, event)));
    console.log("Successfully sent the request to all services");
    res.send({ status: "OK" });
  } catch (error) {
    console.error("Error sending event:", error.message);
    res
      .status(500)
      .send({ status: "Error", message: "Failed to process event" });
  }
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log(`Event Bus is listening on port 4005`);
});
