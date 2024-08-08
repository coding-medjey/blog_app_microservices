const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const event = req.body;
  await axios.post("http://localhost:4000/events", event);
  await axios.post("http://localhost:4001/events", event);
  await axios.post("http://localhost:4002/events", event);
  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("App is Listening on 4005");
});
