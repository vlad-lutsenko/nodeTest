const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT, MONGODB_URL } = require("./helpers/constants");
const userRouter = require("./user/user.router");

class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    await this.initDbConnection();
    this.initMiddleware();
    this.initRoute();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoute() {
    this.server.use("/user", userRouter);
  }

  async initDbConnection() {
    try {
      await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("database connected");
    } catch (error) {
      console.error(error);
    }
  }

  startListening() {
    return this.server.listen(PORT, (err) => {
      err
        ? console.error("server listening error", err)
        : console.log("server listening at port", PORT);
    });
  }
}

module.exports = new Server();
