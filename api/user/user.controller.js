const Joi = require("joi");

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

      const newUser = await userModel.create({
        id,
        password,
        idType,
      });

      const token = newUser.generateToken();
      newUser.token = token;
      newUser[idType] = id;

      await newUser.save();

      res.status(201).send(token);
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
      user.token = token;
      await user.save();

      res.status(200).send(token);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  }

  getInfo(req, res) {
    const user = req.user;
    const { id, idType } = user;
    res.status(200).send({ id, idType });
  }
}

module.exports = new UserController();
