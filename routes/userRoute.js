import express from "express";
import { signUp, login, verifyOtp } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/login', login);
userRouter.post('/verifyOtp', verifyOtp);

export default userRouter;
