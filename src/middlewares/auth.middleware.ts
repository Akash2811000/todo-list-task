import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // #swagger.tags = ['Todo']
    // #swagger.summary = 'Get protected data'
    /* #swagger.security = [{
        "Bearer": []
    }] */
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
