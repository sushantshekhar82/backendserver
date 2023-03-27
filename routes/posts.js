const express = require("express");
const postRouter = express.Router();
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PostModel = require("../model/post");

postRouter.get("/", async (req, res) => {
  const { page, limit, min, max } = req.query;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  if (decoded) {
    const data = await PostModel.find({
      userId: decoded.userId,
      no_of_comments: { $gte: min },
      no_of_comments: { $lte: max },
    })
      .skip(page)
      .limit(3);
    res.status(200).send(data);
  } else {
    res.status(400).send("No Posts found create your Posts");
  }
});

postRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const data = new PostModel(payload);
    await data.save();
    res.status(200).send("Post added");
  } catch (error) {
    res.status(400).send({ msg: `ERROR${error.message}` });
  }
});
postRouter.get("/top", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  if (decoded) {
    const data = await PostModel.find({ userId: decoded.userId }).limit(3);
    res.status(200).send(data);
  } else {
    res.status(400).send("No Posts found create your Posts");
  }
});
postRouter.patch("/:postid", async (req, res) => {
  const { postid } = req.params;
  const payload = req.body;
  try {
    await PostModel.findByIdAndUpdate(postid, payload);
    res.status(200).send({ msg: "Post has been updated" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
postRouter.delete("/:postid", async (req, res) => {
  const { postid } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "masai");
  const req_id = decoded.userId;
  const userId_post = PostModel.findOne({ _id: postid });

  try {
    if (req_id === userId_post) {
      await PostModel.findByIdAndDelete({ _id: postid });
      res.status(200).send({ msg: "Post has been deleted" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
module.exports = postRouter;
