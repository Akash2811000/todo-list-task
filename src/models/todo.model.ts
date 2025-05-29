import { Schema, model, Document, Types } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date, index: true },
    completed: { type: Boolean, default: false, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// Compound index to find overdue and incomplete todos quickly
todoSchema.index({ dueDate: 1, completed: 1 });

const Todo = model<ITodo>("Todo", todoSchema);

export default Todo;
