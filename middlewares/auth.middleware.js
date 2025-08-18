import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";


export const authorize = (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach decoded data (not the whole user object → keeps middleware light)
        req.user = {
            id: decoded.userId,
            role: decoded.role || "user", // default to user if not present
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            error: error.message,
        });
    }
};

// ✅ Role-based authorization (for admin-only routes)
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};