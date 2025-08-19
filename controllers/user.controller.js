import User from "../models/user.model.js";


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
