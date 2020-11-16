const userModel = require("../user/user.model");
const { SECRET_KEY } = require("../helpers/constants");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization") || "";
    const token = authorizationHeader.replace("Bearer ", "");
    let userId;
    try {
      userId = await jwt.verify(token, SECRET_KEY).id;
    } catch (error) {
      console.error(error);
      return res.status(403).send({ message: "not authenticated" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      console.error("not authenticated");
      return res.status(403).send({ message: "not authenticated" });
    } else if (
      Date.now() >= user.tokenLifetime ||
      !user.allTokens.includes(token)
    ) {
      console.error("not authenticated");
      return res.status(403).send({ message: "not authenticated" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = authMiddleware;
