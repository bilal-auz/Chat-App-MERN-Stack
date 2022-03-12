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
    // res.send(req.user);
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
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

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: "Please Fill all the fields " });
  }

  //   res.send(req.body.users);
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "Needs more than 2 users to create a group chat" });
  }

  //add the logged user into users
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users: [...users],
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if ((!chatId, !chatName)) {
    return res.status(400).send({ message: "Please Fill all the fields " });
  }
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName, //chatName: chatName
    },
    {
      new: true, //return the updated chat
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroupChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedGroupChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if ((!chatId, !userId)) {
    return res.status(400).send({ message: "Please Fill all the fields " });
  }

  try {
    var addedUser = await Chat.findOneAndUpdate(
      { $and: [{ _id: chatId }, { isGroupChat: true }] },
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }

  if (!addedUser) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    // console.log(addedUser);
    res.json(addedUser);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if ((!chatId, !userId)) {
    return res.status(400).send({ message: "Please Fill all the fields " });
  }

  try {
    var deletedUser = await Chat.findOneAndUpdate(
      { $and: [{ _id: chatId }, { isGroupChat: true }] },
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  } catch (error) {
    res.status(404);
    throw new Error(error.message);
  }

  if (!deletedUser) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    // console.log(addedUser);
    res.json(deletedUser);
  }
};
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
