const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY, SALT_ROUNDS } = require("../helpers/constants");
const { func } = require("joi");

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  password: { type: String, required: true },
  id_type: String,
  tokenLifetime: Number,
  allTokens: [String],
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

userSchema.method("isPasswordValid", async function (password) {
  return bcrypt.compare(password, this.password);
});

userSchema.method("generateToken", function () {
  this.tokenLifetime = Date.now() + 6e5;
  return jwt.sign({ id: this._id }, SECRET_KEY);
});

userSchema.method("continueTokenLife", function () {
  this.tokenLifetime = Date.now() + 6e5;
});

module.exports = mongoose.model("User", userSchema);
