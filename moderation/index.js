const { default: axios } = require("axios");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "commentCreation") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "commentModeration",
      data: {
        ...data,
        status,
      },
    });
  }
});

app.listen(4003, () => {
  console.log("App is Listening on 4003");
});
