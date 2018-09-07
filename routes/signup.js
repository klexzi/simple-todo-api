const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const logger = require("../setup/logger");
const { validate, User } = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const EmailExist = await User.findOne({
    email: req.body.email
  });
  if (EmailExist)
    return res
      .status(400)
      .json({ error: "User with that email already exist" });

  let user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).json({ token });
});

module.exports = router;
