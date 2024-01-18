import express from "express";
import dotenv from "dotenv";
import { cancelledOrder, createOrder, detailOrder, getAllOrders, getOrdersForMember, updateOrder } from "../controller/order";
import User from "../models/user";
import jwt from "jsonwebtoken"
import authentication from "../middlewares/authentication";
dotenv.config();
const router = express.Router()
router.post("/order", async (req, res, next) => {
    const token = req.cookies?.accessToken;
     console.log(token);
    if (!token) {
      req.user = null;
      next();
      return;
    }
    jwt.verify(
      token,
      process.env.SERECT_ACCESSTOKEN_KEY,
      async (err, payload) => {
        if (err) {
          if (err.name == "JsonWebTokenError") {
            return res.status(402).json({
              message: "Refresh Token is invalid", 
            });
          }
          if (err.name == "TokenExpiredError") {
            return res.status(403).json({
              message: "Refresh Token is expired ! Login again please !",
            });
          }
        }
        const user = await User.findById(payload._id);
        req.user = user;
        next();
        
      }
    );
  },createOrder)
  router.get("/orderMember",authentication,getOrdersForMember)
  router.get("/orders/:id",detailOrder)
  router.delete("/orders/:id",cancelledOrder)
  router.get("/orders/",getAllOrders)
  router.patch("/orders/:id",updateOrder)

export default router
