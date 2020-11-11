const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  SECRET_KEY: process.env.SECRET_KEY,
};
