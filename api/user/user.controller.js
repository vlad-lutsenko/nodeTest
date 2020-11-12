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

      const isUserExists = await userModel.findOne({ id });

      if (isUserExists) {
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

      res.status(200).send(token);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new UserController();
