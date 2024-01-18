import express  from "express";
import { create, get, getAll, update ,remove, relatedProducts} from "../controller/products";
import { authorization } from "../middlewares/authorization";


const router = express.Router()
router.get("/products",getAll)
router.get("/products/:id",get)
router.get("/products-related/:categoryId",relatedProducts)
router.patch("/products/:id" ,update)
router.post("/products", authorization,create)
router.delete("/products/:id" ,remove)

export default router