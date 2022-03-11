const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, allUsers);

router.post("/", registerUser);
router.post("/login", loginUser);

module.exports = router;
