import express from "express";
import { logOut, redirect, signIn, SignUp } from "../controller/auth";
import passport from "passport";
const authRouter = express.Router()
authRouter.post("/auth/register",SignUp )
authRouter.post("/auth/login",signIn )
authRouter.delete("/auth/logout",logOut )
authRouter.get('/auth/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/auth/google/redirect', passport.authenticate('google', { failureRedirect: '/error' }), redirect);
export default authRouter
