import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Todo, { ITodo } from "../models/todo.model";
import { FilterQuery } from "mongoose";

export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const todo = await Todo.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.userId,
    });

    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo", error: err });
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
    const { completed, overdue } = req.query;

    const filter: FilterQuery<ITodo> = {
      user: req.userId!,
    };

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (overdue === "true") {
      filter.dueDate = { $lt: new Date() };
      filter.completed = false;
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
    const { title, description, dueDate, completed } = req.body;

    const updateData: Partial<
      Pick<ITodo, "title" | "description" | "dueDate" | "completed">
    > = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : undefined;
    }
    if (completed !== undefined) updateData.completed = completed;

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
