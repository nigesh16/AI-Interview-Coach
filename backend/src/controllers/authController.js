const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); 

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', 
  });
};


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }
  if(password.length < 6) {
    return res.status(400).json({message: "Password must be at least 6 characters long"});
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({message: "Email and password are required"});
  }

  const user = await User.findOne({ email });

   if(!user) return res.status(401).json({message: "Invalid email or password"});
   
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  loginUser,
};
