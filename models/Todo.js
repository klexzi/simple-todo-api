const mongoose = require("mongoose");
const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);
const { User } = require("./User");

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  date_created: {
    type: String,
    default: Date.now()
  }
});

const Todo = mongoose.model("Todo", todoSchema);

const validateTodo = function(todo) {
  const schema = {
    userId: Joi.ObjectId().required(),
    description: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(todo, schema);
};

const validateTodoUserId = function(todo) {
  const schema = {
    userId: Joi.ObjectId().required()
  };
  return Joi.validate(todo, schema);
};

const validateTodoId = function(todo) {
  const schema = {
    id: Joi.ObjectId().required()
  };
  return Joi.validate(todo, schema);
};

/*
* @construct validate a todo to be edited which must hold the id of the todo data
*@param {todo} of type object
*/
const validateEditTodo = function(todo) {
  const schema = {
    id: Joi.ObjectId().required(),
    userId: Joi.ObjectId().required(),
    description: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(todo, schema);
};
module.exports.Todo = Todo;
module.exports.validate = validateTodo;
module.exports.validateUserId = validateTodoUserId;
module.exports.validateEdit = validateEditTodo;
module.exports.validateId = validateTodoId;
