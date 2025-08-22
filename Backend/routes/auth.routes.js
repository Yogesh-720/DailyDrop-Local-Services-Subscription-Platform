import { Router } from 'express';
import {signIn, signOut, signUp, verifyEmail, verifyPhone} from "../controllers/auth.controller.js";

const authRouter = Router();

// POST /api/v1/auth/signup
authRouter.post('/signup', signUp);

// POST /api/v1/auth/signin
authRouter.post('/signin', signIn);

// POST /api/v1/auth/signout
authRouter.post('/signout', signOut);

authRouter.get("/verify-mail/:verifyToken", verifyEmail);

authRouter.post('/verify-phone', verifyPhone);

export default authRouter;
