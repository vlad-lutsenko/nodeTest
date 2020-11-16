const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  createUser,
  loginUser,
  getInfo,
  getLatency,
  userLogout,
} = require("./user.controller");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.get("/info", authMiddleware, getInfo);
router.get("/latency", authMiddleware, getLatency);
router.get("/logout/:all", authMiddleware, userLogout);

module.exports = router;
