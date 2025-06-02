import { Request, Response, NextFunction, request, response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  userId?: string;
  user?: IUser;
}
interface PermissionVerificationOptions {
  permissionsRequired: string[];
  authHeaderRequired: boolean;
}
export function authMiddleware({
  permissionsRequired = [],
  authHeaderRequired = true,
}: PermissionVerificationOptions) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
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
      const user = await User.findById({ _id: req.userId });

      if (
        user &&
        user.role === "admin" &&
        authHeaderRequired &&
        permissionsRequired.includes("admin")
      ) {
        next();
        return;
      } else {
        res.status(403).json({ message: "Access denied." });
        return;
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

export const checkRoleMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // #swagger.tags = ['Todo']
    // #swagger.summary = 'Get protected data'
    /* #swagger.security = [{
        "Bearer": []
    }] */

    const user = await User.findById({ _id: req.userId });

    if (user && user.role === "admin") {
      req.user = user;
    } else {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
