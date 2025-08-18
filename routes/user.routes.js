import { Router } from 'express';
import { getMe, updateMe } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// GET /api/v1/users/me → get own profile
userRouter.get('/me', authorize, getMe);

// PATCH /api/v1/users/me → update own profile (phone, addresses, prefs)
userRouter.patch('/me', authorize, updateMe);

export default userRouter;
