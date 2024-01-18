import express from "express";
import { logOut, signIn, SignUp } from "../controller/auth";

const authRouter = express.Router()
authRouter.post("/auth/register",SignUp )
authRouter.post("/auth/login",signIn )
authRouter.delete("/auth/logout",logOut )
export default authRouter
