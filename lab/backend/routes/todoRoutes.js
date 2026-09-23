const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
});

// POST a new todo
router.post("/", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || task.trim() === "") {
      return res.status(400).json({
        message: "Task cannot be empty",
      });
    }

    const newTodo = new Todo({
      task: task.trim(),
      completed: false,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add todo",
      error: error.message,
    });
  }
});

// UPDATE a todo
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update todo",
      error: error.message,
    });
  }
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete todo",
      error: error.message,
    });
  }
});

module.exports = router;