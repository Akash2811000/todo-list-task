import { Response } from "express";
import { FilterQuery } from "mongoose";
import { validationError } from "../helpers/response";
import { AuthRequest } from "../middlewares/auth.middleware";
import Todo, { ITodo } from "../models/todo.model";

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate } = req.body;
    const errors: Record<string, string> = {};

    if (!title) {
      errors.title = "Title is required";
    }

    if (dueDate === undefined || dueDate === null) {
      errors.dueDate = "Due date is required";
    } else {
      let timestamp = Number(dueDate);
      if (timestamp < 1e12) {
        timestamp *= 1000;
      }
      const parsedDate = new Date(timestamp);

      if (isNaN(timestamp) || isNaN(parsedDate.getTime())) {
        errors.dueDate =
          "Due date must be a valid Unix timestamp in milliseconds";
      } else {
        const now = new Date();
        if (parsedDate <= now) {
          errors.dueDate = "Due date must be in the future";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      validationError(res, errors);
      return;
    }

    const parsedDate = new Date(Number(dueDate));

    const todo = await Todo.create({
      title,
      description,
      dueDate: parsedDate,
      user: req.userId,
    });
    console.log("todo", todo);
    return res.status(201).json({ message: "Todo created successfully", todo });
    return;
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo", error: err });
    return;
  }
};

export const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { completed } = req.query;

    const filter: FilterQuery<ITodo> = {
      user: req.userId!,
    };

    if (completed !== undefined) {
      filter.completed = completed === "true";

      if (typeof completed === "string") {
        if (completed === "true" || completed === "false") {
          filter.completed = completed === "true";
        } else {
          res.status(400).json({
            message:
              "Invalid value for 'completed'. Must be 'true' or 'false'.",
          });
          return;
        }
      }
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    res.json({
      message: "Todos retrieved successfully",
      count: todos.length,
      todos,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve todos", error: err });
  }
};

export const getTodoById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, user: req.userId });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ message: "Todo retrieved successfully", todo });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve todo", error: err });
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const updateData: Partial<
      Pick<ITodo, "title" | "description" | "dueDate">
    > = {};

    const errors: Record<string, string> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (dueDate !== undefined) {
      let timestamp = Number(dueDate);
      if (timestamp < 1e12) {
        timestamp *= 1000;
      }
      const parsedDate = new Date(timestamp);

      if (isNaN(timestamp) || isNaN(parsedDate.getTime())) {
        errors.dueDate =
          "Due date must be a valid Unix timestamp in milliseconds";
      } else {
        const now = new Date();
        if (parsedDate <= now) {
          errors.dueDate = "Due date must be in the future";
        } else {
          updateData.dueDate = parsedDate;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      validationError(res, errors);
      return;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ message: "Todo updated successfully", todo });
  } catch (err) {
    res.status(500).json({ message: "Failed to update todo", error: err });
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ message: "Todo deleted successfully", todo });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo", error: err });
  }
};

export const toggleTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, user: req.userId });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ message: "Todo status toggled successfully", todo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle todo status", error: err });
  }
};
