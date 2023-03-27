const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const fieldcheck = require("../middleware/fieldcheck");
const UserModel = require("../model/usermodel");

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    res.status(400).send({ msg: "user already exist" });
  } else {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({
        name,
        email,
        gender,
        password: hash,
        age,
        city,
        is_married,
      });
      await user.save();
      res.status(200).send({ " msg": "Register done" });
    });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    console.log(user);
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res.status(200).send({
          msg: "Login successful",
          token: jwt.sign({ userId: user._id }, "masai"),
        });
      } else {
        res.status(400).send({
          msg: "Wrong credential",
        });
      }
    });
  }
});

userRouter.get("/", async (req, res) => {
  const data = await UserModel.find();
  res.status(200).send(data);
});

module.exports = userRouter;
