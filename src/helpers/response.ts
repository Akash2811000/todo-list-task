import { Response } from "express";

export const validationError = (res: Response, errors: Record<string, any>) =>
  res.status(400).json({ message: "Validation failed", errors });

export const serverError = (res: Response, err: any) => {
  console.error("Server error:", err);
  return res
    .status(500)
    .json({ message: "Internal server error. Please try again later." });
};

export const response = (res: Response, message: string, data?: any) => {
  return res.status(200).json({ message });
};
