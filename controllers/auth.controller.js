import mongoose from "mongoose";
import User from "../models/user.model.js"; // ensure correct import
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// ================== SIGN UP ==================
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { name, email, phone, password } = req.body;

            // Check if user already exists (optional, mongoose will also catch duplicates)
            const existingUser = await User.findOne({
                $or: [{ email }, { phone }]
            }).session(session);

            if (existingUser) {
                const err = new Error("User already exists");
                err.statusCode = 409;
                throw err;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const newUser = {
                name,
                email,
                phone,
                password: hashedPassword
            };

            const user = await User.create(
                [newUser],
                { session }
            );
            const created = user[0];

            // Generate JWT
            const token = jwt.sign(
                { userId: created._id, role: created.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            const userToSend = created.toObject();
            delete userToSend.password;

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: { token, user: userToSend },
            });
        });
    } catch (err) {
        next(err);
    } finally {
        session.endSession();
    }
};

// ================== SIGN IN ==================
export const signIn = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;

        const query = {};
        if (email) {
            query.email = email;
        } else if (phone) {
            query.phone = phone;
        }

        // Use the dynamically built query
        const user = await User.findOne(query).select("+password");

        if (!user) {
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: { token, user: userToSend },
        });
    } catch (err) {
        next(err);
    }
};

// ================== SIGN OUT ==================
export const signOut = async (req, res, next) => {
    try {
        // JWT is stateless → logout handled in frontend
        // For server-side invalidation: implement Redis blacklist
        res.status(200).json({
            success: true,
            message: "User signed out successfully",
        });
    } catch (err) {
        next(err);
    }
};
