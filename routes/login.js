const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");

/*
*@params {user}: of type object data type
*/
const validate = user => {
  const schema = {
    email: Joi.string()
      .min(8)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
};

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid username or password" });

  let validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid username or password" });

  const token = user.generateAuthToken();
  res.status(200).json({ token });
});

module.exports = router;
