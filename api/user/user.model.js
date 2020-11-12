const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY, SALT_ROUNDS } = require("../helpers/constants");

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  password: { type: String, required: true },
  idType: { type: String, enum: ["email", "phone"] },
  token: String,
  phone: String,
  email: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

userSchema.method("isPasswordValid", async (password) => {
  const result = await bcrypt.compare(password, this.password);
  return result;
});

userSchema.method("generateToken", () => {
  return jwt.sign({ _id: this._id }, SECRET_KEY, { expiresIn: 600 });
});

module.exports = mongoose.model("User", userSchema);
