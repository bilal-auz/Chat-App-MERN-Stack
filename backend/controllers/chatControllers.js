const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not found");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") //except passwords
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  //   res.status(201).send(isChat[0]);

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chat_data = {
      chatName: "First Chat",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chat_data);

      const fullChatData = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).send(fullChatData);
    } catch (error) {
      res.status(400);
      throw new Error(error.messsage);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password");

    res.send(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.messsage);
  }
};
module.exports = { accessChat, fetchChats };
