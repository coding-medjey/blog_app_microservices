const axios = require("axios");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log(`Received event: ${type}`);

  if (type === "commentCreation") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "commentModeration",
        data: {
          ...data,
          status,
        },
      });
      console.log(
        `Moderation completed for comment ${data.id}. Status: ${status}`
      );
      res.status(200).send({ status: "Moderation completed" });
    } catch (error) {
      console.error("Error sending moderation event:", error.message);
      res.status(500).send({ error: "Failed to process moderation" });
    }
  } else {
    res.status(200).send({ status: "Event acknowledged" });
  }
});

app.listen(4003, () => {
  console.log("Moderation service listening on port 4003");
});
