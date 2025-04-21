/*
Simple backend that provides a "word of the day" based on the current day of the week.
*/

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

// Serve static files from frontend
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const dictionary = [
  "alien",
  "laugh",
  "bayou",
  "zebra",
  "onion",
  "hello",
  "apple",
];

const getDailyWord = () => {
  const today = new Date();
  return dictionary[today.getDay()];
};

app.use(cors());
app.use(express.json());

app.get("/word", (req, res) => {
  res.json({ word: getDailyWord() });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}...`);
});
