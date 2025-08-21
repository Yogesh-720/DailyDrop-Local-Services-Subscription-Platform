import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import crypto from "crypto";

// ================== SIGN UP ==================
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const { name, email, phone, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { phone }]
            }).session(session);

            if (existingUser) {
                const err = new Error("User already exists");
                err.statusCode = 409;
                throw err;
            }

            const verifyToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

            const user = new User({
                name,
                email,
                phone,
                password,
                emailVerificationToken: hashedToken,
                emailVerificationExpire: Date.now() + 15 * 60 * 1000
            });

            await user.save({ session });


            res.status(201).json({
                success: true,
                message: "User created successfully. Please verify you mail.",
                data: { verifyToken, user: user.getPublicProfile() },
            });
        });
    } catch (err) {
        next(err);
    } finally {
        session.endSession();
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const {verifyToken} = req.params;
        const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            const error = new Error("Invalid or expired verification token");
            error.statusCode = 400;
            throw error;
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
        });
    }
    catch (err) {
        next(err);
    }
};


// ================== SIGN IN ==================
export const signIn = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // Use the dynamically built query
        const user = await User.findOne({phone}).select("+password");

        if (!user) {
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }

        if(!user.isEmailVerified){
            const error = new Error("Please verify your email first...");
            error.statusCode = 403;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        if (!user.isPhoneVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOTP = await bcrypt.hash(otp, 10);

            user.phoneOTP = hashedOTP;
            user.phoneOTPExpire = Date.now() + 60 * 1000;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "OTP sent to phone, valid for 60 seconds.",
                phoneOTP: otp
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: { token, user: user.getPublicProfile() },
        });
    } catch (err) {
        next(err);
    }
};

export const verifyPhone = async (req, res, next) => {
    try {
        const { phone,otp } = req.body;

        const user = await User.findOne({ phone });
        if (!user || !user.phoneOTP || !user.phoneOTPExpire) {
            throw new Error("User not exists!! OTP not generated");
        }

        if (Date.now() > user.phoneOTPExpire) {
            throw new Error("OTP expired");
        }

        const isMatch = await bcrypt.compare(otp, user.phoneOTP);
        if (!isMatch) {
            throw new Error("Invalid OTP");
        }

        user.isPhoneVerified = true;
        user.phoneOTP = undefined;
        user.phoneOTPExpire = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            success: true,
            message: "Phone verified successfully, login complete",
            data: {token, user: user.getPublicProfile() },
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
