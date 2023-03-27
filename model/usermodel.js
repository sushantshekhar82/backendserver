const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  password: String,
  age: Number,
  city: String,
  is_married: Boolean,
});
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
