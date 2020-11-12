const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createUser, loginUser, getInfo } = require("./user.controller");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.get("/info", authMiddleware, getInfo);

module.exports = router;
