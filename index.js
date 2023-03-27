const express = require("express");
const mongoose = require("mongoose");
const connection = require("./db");
const { auth } = require("./middleware/auth");
const postRouter = require("./routes/posts");
const userRouter = require("./routes/user");
auth;
const app = express();
require("dotenv").config();
app.use(express.json());
app.use("/users", userRouter);
app.use(auth);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  await connection;

  console.log("connected to mongo atlas");
});
