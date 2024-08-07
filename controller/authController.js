const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserActivation = require("../models/user");

exports.register = async (req, res) => {
    const { user_name, password, name, role } = req.body;
    try {
      if (!user_name || !password || !name || !role) {
        return res.status(400).send("All fields are required");
      }
      
      const existingUser = await UserActivation.findOne({ user_name });
      if (existingUser) return res.status(400).send("User already exists");
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserActivation({ user_name, password: hashedPassword, name, role });
      await user.save();
      res.status(201).send("User registered");
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
  

exports.login = async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const user = await UserActivation.findOne({ user_name });
    if (!user) return res.status(400).send("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");
    const accessToken = jwt.sign(
      { userId: user._id, user_name: user.user_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, user_name: user.user_name },
      process.env.REFRESH_TOKEN_SECRET
    );
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: user.userId, user_name: user.user_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};
