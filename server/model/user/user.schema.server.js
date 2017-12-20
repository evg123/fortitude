const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  admin: {type: Boolean, default: false},
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  dateCreated: {type: Date, default: Date.now}
}, {collection: 'user'});

module.exports = UserSchema;
