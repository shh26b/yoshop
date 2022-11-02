import { Router } from "express";
import {
    getUser,
    loginUser,
    createUser,
} from "../controllers/userController.js";
import protect from "../middlewares/protect.js";
const userRouter = Router();

/**
 * @desc Create new user
 * @router POST /api/users
 * @access Public
 */
userRouter.post("/", createUser);

/**
 * @desc Auth user & get token
 * @router POST /api/users/login
 * @access Public
 */
userRouter.post("/login", loginUser);

/**
 * @desc Auth user & get token
 * @router GET /api/users/profile
 * @access Private
 */
userRouter.get("/profile", [protect], getUser);

export default userRouter;