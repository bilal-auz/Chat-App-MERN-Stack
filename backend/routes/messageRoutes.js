const express = require("express");
const {
  getChatMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:chatId", protect, getChatMessages);

router.post("/", protect, sendMessage);

module.exports = router;
