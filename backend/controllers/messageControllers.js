const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getChatMessages = async (req, res) => {
  console.log(req.params.chatId);
  if (!req.params.chatId) {
    throw new Error("No Chat Id");
  }

  try {
    const messsages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.send(messsages);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
};

const sendMessage = async (req, res) => {
  // req = user + chatId + content

  if (!req.body.chatId || !req.body.content) {
    res.status(400);
    throw new Error("Please Fill all the fields");
  }

  try {
    var message = {
      sender: req.user._id,
      content: req.body.content,
      chat: req.body.chatId,
    };

    var newMessage = await Message.create(message);
    newMessage = await newMessage.populate("sender", "name pic");
    newMessage = await newMessage.populate("chat");

    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: newMessage,
    });

    res.status(200);
    res.send(newMessage);

    // res.send(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
};

module.exports = { getChatMessages, sendMessage };
