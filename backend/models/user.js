const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleAuth;
    },
  },
  image:{
    type: String,
  },
  googleAuth: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
