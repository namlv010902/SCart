import express from "express";
import { getProfile } from "../controller/user";
import authentication from "../middlewares/authentication";


const router = express.Router()
router.get("/profile",authentication,getProfile )

export default router
