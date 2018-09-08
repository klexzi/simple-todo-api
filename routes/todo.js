const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/User");
const {
  Todo,
  validate,
  validateUserId,
  validateId,
  validateEdit
} = require("../models/Todo");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, async (req, res) => {
  let todos = await Todo.find()
    .sort("-date_created")
    .populate("userId", "name")
    .exec();
  res.status(200).json(todos);
});

router.get("/:id", authenticate, async (req, res) => {
  const { error } = validateId({ id: req.params.id });
  if (error) return res.status(400).json({ error: error.details[0].message });

  let todo = await Todo.findById(req.params.id)
    .populate("userId", "name")
    .exec();

  if (!todo) return res.status(404).json({ error: "todo list not found" });

  res.status(200).json(todo);
});

router.post("/", authenticate, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = User.findOne({ _id: req.body.userId });
  if (!user)
    return res.status(400).json({ error: "No user found with the given id" });

  let todo = new Todo(_.pick(req.body, ["userId", "description"]));
  todo.save();
  res.status(200).json(todo);
});

router.put("/:id", authenticate, async (req, res) => {
  const { error } = validateEdit({ id: req.params.id, ...req.body });
  if (error) return res.status(400).json({ error: error.details[0].message });

  let todo = await Todo.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { ...req.body } },
    { new: true }
  ).select("-password");
  if (!todo)
    return res.status(400).json({ error: "No todo list with the given id" });

  res.status(200).json(todo);
});

router.delete("/:id", authenticate, async (req, res) => {
  const { error } = validateId({ id: req.params.id });
  if (error) return res.status(400).json({ error: error.details[0].message });

  let todo = await Todo.findOneAndRemove({ _id: req.params.id });
  if (!todo) return res.status(404).json({ error: "Todo list not found" });
  res.status(200).json(todo);
});

module.exports = router;
