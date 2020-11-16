const Joi = require("joi");
const axios = require("axios");

const userModel = require("./user.model");

class UserController {
  async createUser(req, res) {
    try {
      let idType;

      const { id, password } = req.body;

      if (!isNaN(id)) {
        idType = "phone";
      } else if (!Joi.string().email().validate(id).error) {
        idType = "email";
      } else {
        return res.status(400).send({ message: "invalid input" });
      }

      const doesUserExist = await userModel.findOne({ id });

      if (doesUserExist) {
        return res
          .status(409)
          .send({ message: "user with such id already exists" });
      }

      const user = await userModel.create({
        id,
        password,
      });

      user.id_type = idType;

      const token = user.generateToken();

      user.allTokens.push(token);

      await user.save();

      res.status(201).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }

  async loginUser(req, res) {
    try {
      const { id, password } = req.body;

      const user = await userModel.findOne({ id });
      if (!user) {
        return res.status(409).send({ message: "invalid input" });
      }

      const passwordValidation = await user.isPasswordValid(password);
      if (!passwordValidation) {
        return res.status(409).send({ message: "invalid input" });
      }

      const token = user.generateToken();

      user.allTokens.push(token);
      await user.save();

      res.status(200).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }

  async getInfo(req, res) {
    try {
      const user = req.user;
      const { id, id_type } = user;

      user.continueTokenLife();
      await user.save();

      res.status(200).send({ id, id_type });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }

  async getLatency(req, res) {
    try {
      const start = Date.now();
      await axios.get("http://www.google.com");
      const finish = Date.now();
      const latency = finish - start;

      const user = req.user;
      user.continueTokenLife();

      res.status(200).send({ latency });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }

  async userLogout(req, res) {
    try {
      const all = req.params.all;
      const allTokensToDelete = all === "true";

      const user = req.user;
      const token = req.token;

      if (allTokensToDelete) {
        user.allTokens = [];
      } else {
        const index = user.allTokens.indexOf(token);
        user.allTokens.splice(index, 1);
      }
      await user.save();

      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }
}

module.exports = new UserController();
