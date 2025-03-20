import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include `user`
interface AuthenticatedRequest extends Request {
    user?: any; // Use a proper type for user (e.g., `Record<string, any>` or a User interface)
  }
  

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // Attach user to request
        next(); // Call next middleware
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
