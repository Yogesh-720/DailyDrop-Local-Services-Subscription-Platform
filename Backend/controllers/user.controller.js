import User from "../models/user.model.js";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// @route GET /api/v1/users/me
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @route   PATCH /api/v1/users/me
export const updateMe = async (req, res, next) => {
    try {
        const allowedFields = ["phone", "addresses", "notificationPrefs", "name", "email"];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @access  Private (logged-in user)
export const deleteMe = async (req, res, next) => {
    try {
        // req.user.id JWT ke payload se aa raha hai (auth.middleware)
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "Your account has been deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};


// @route   GET /api/v1/users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

// @route   GET /api/v1/users/:id
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};


// @route   PATCH /api/v1/users/:id
export const updateUserById = async (req, res, next) => {
    try {
        const allowedFields = ["name", "email", "phone", "role", "addresses", "notificationPrefs"];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @route   DELETE /api/v1/users/:id
export const deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { newPassword, oldPassword } = req.body;

        const user = await User.findById(req.user.id).select("+password");
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            const err = new Error("Old password is incorrect");
            err.statusCode = 400;
            throw err;
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (err) {
        next(err);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const {email, phone} = req.body;
        const query = {};

        if(email) query.email = email;
        if (phone) query.phone = phone;

        const user = await User.findOne(query);
        if (!user) {
            const err = new Error("User does not exist");
            err.statusCode = 404;
            throw err;
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Password reset token generated",
            resetToken,
        });
    }
    catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const {resetToken} = req.params;
        const { newPassword } = req.body;

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select("+password");

        if (!user) {
            const err = new Error("Invalid or expired reset token");
            err.statusCode = 400;
            throw err;
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        const authToken = await jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: "Password reset successfully",
            authToken: authToken
        });
    }
    catch (err) {
        next(err);
    }
};
