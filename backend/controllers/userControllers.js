const User = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password, confPassword, pic } = req.body;

  if (!name || !email || !password || !confPassword) {
    res.status(400);
    throw new Error("Fill all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
    });
  } else {
    res.status(400);
    throw new Error("Error occur while creating user, Please try again");
  }
};

module.exports = { registerUser };
