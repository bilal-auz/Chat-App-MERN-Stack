const express = require("express");
const connect_db = require("./config/db");
const dotenv = require("dotenv");
const chats = require("./data/data");
require("express-async-errors");

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
// Middlewares
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

dotenv.config();

connect_db();
const app = express();

app.use(express.json()); //accept json data

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

// Error handlers middelwares
app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server Started on Port: ", PORT));
