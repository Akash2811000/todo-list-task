import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { serverError, validationError } from "../helpers/response";
import { generateToken } from "../helpers/token";
import User from "../models/user.model";
import { validateEmail, validatePassword } from "../utils/validators";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      validationError(res, {
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
      });
      return;
    }

    if (!validateEmail(email)) {
      validationError(res, { email: "Invalid email address" });
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      validationError(res, { password: passwordErrors });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        message: "Registration failed",
        errors: { email: "An account with this email already exists" },
      });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "email";
      res.status(409).json({
        message: "Registration failed",
        errors: { [field]: `An account with this ${field} already exists` },
      });
      return;
    }

    if (err.name === "ValidationError") {
      const errors: Record<string, string> = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      validationError(res, errors);
      return;
    }

    serverError(res, err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      validationError(res, {
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
      });
    }

    if (!validateEmail(email)) {
      validationError(res, { email: "Invalid email address" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ userId: user?._id, email: user?.email });

    res.json({
      message: "Login successful",
      token,
      user: { id: user?._id, email: user?.email },
    });
  } catch (err) {
    serverError(res, err);
  }
};
