const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxlength: 1024
  }
});

/*
* Generate Auth token For the user using json web token
*
*/
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email
    },
    config.get("JWTSecret"),
    { expiresIn: "5h" }
  );
};
const User = mongoose.model("User", userSchema);

/*
* Validate the request input
*@params user. should be an object
*/
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(255)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

function validateChangePassword(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    oldPassword: Joi.string()
      .min(8)
      .max(255)
      .required(),
    newPassword: Joi.string()
      .min(8)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateChangePassword = validateChangePassword;
