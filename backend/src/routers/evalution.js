import express from "express";
import { createEvaluation, getEvaluationByIdProduct } from "../controller/evaluation";


const router = express.Router()
router.post("/evaluation", createEvaluation)
router.get("/evaluationByIdProduct/:id", getEvaluationByIdProduct)

export default router
