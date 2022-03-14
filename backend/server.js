const express = require("express");
const connect_db = require("./config/db");
const dotenv = require("dotenv");
const chats = require("./data/data");
require("express-async-errors");

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
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
app.use("/api/message", messageRoutes);

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

const server = app.listen(PORT, console.log("Server Started on Port: ", PORT));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("setup", (user) => {
    socket.join(user._id);
    console.log("connected:", user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (chat) => {
    socket.join(chat);
    console.log("user joined chat:", chat);
  });

  socket.on("typing", (chat) => socket.in(chat).emit("typing"));
  socket.on("stoptyping", (chat) => socket.in(chat).emit("stop typing"));
  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;

    console.log(newMessageRecived);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(user._id);
  });
});
