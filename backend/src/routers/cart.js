import express from "express";
import { addToCart, getCart, removeOneProductInCart, updateProductQuantityInCart } from "../controller/cart";
import authentication from "../middlewares/authentication";


const router = express.Router()
router.post("/cart", authentication, addToCart)
router.patch("/cart", authentication, updateProductQuantityInCart)
router.get("/cart", authentication, getCart)
router.delete("/cart/", authentication, removeOneProductInCart)
export default router
