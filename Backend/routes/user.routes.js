import { Router } from "express";
import {
    getMe,
    updateMe,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById, deleteMe, changePassword, forgotPassword, resetPassword
} from "../controllers/user.controller.js";
import { authorize, authorizeAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// GET /api/v1/users/me → get own profile
userRouter.get("/me", authorize, getMe);

// PATCH /api/v1/users/me → update own profile
userRouter.patch("/me", authorize, updateMe);

// DELETE /api/v1/users/me → delete own account
userRouter.delete("/me", authorize, deleteMe);


// PATCH /api/v1/users/me/change-password
userRouter.patch("/me/change-password", authorize, changePassword);

// POST /api/v1/users/forgot-password
userRouter.post("/forgot-password", forgotPassword);

// POST /api/v1/users/reset-password/:token
userRouter.post("/reset-password/:resetToken", resetPassword);


// GET /api/v1/users → get all users
userRouter.get("/", authorize, authorizeAdmin, getAllUsers);

// GET /api/v1/users/:id → get user by ID
userRouter.get("/:id", authorize, authorizeAdmin, getUserById);

// PATCH /api/v1/users/:id → update user by ID
userRouter.patch("/:id", authorize, authorizeAdmin, updateUserById);

// DELETE /api/v1/users/:id → delete user by ID
userRouter.delete("/:id", authorize, authorizeAdmin, deleteUserById);

export default userRouter;
