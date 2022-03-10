const express = require("express");
const connect_db = require("./config/db");
const dotenv = require("dotenv");
const chats = require("./data/data");

dotenv.config();

connect_db();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.listen(PORT, console.log("Server Started on Port: ", PORT));
