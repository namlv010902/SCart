import express from "express";

import { create, get, getAll, removeCategory, updateCategory } from "../controller/categories";


const router = express.Router();
router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", create);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", removeCategory);

export default router;