const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { User, validateChangePassword } = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/", authenticate, async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ error: "user not found" });

  let validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid password" });
  const userId = user._id;
  const salt = await bcrypt.genSalt(10);
  req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
  user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { password: req.body.newPassword } }
  ).select("-password");

  //test the implementation
  if (!user) return res.status(400).json({ error: "Error changing password" });

  res.status(200).json(user);
});

module.exports = router;
