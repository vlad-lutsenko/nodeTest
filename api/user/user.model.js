const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { SALT_ROUNDS } = require("../helpers/constants");

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  password: { type: String, required: true },
  id_type: { type: String, enum: ["email", "phone"] },
  token: String,
});

userSchema.pre("save", async (next) => {
  if (!this.isNew) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

userSchema.method("isPasswordValid", async (password) => {
  const result = await bcrypt.compare(password, this.password);
  return result;
});
