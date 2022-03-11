const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, fetchChats);

router.post("/", protect, accessChat);
router.post("/creategroupchat", protect, createGroupChat);

router.put("/renamegroupchat", protect, renameGroup);
router.put("/addtogroup", protect, addToGroup);
router.put("/removefromgroup", protect, removeFromGroup);

module.exports = router;
