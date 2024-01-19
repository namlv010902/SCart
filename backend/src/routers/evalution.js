import express from "express";
import { createEvaluation, getAllEvaluation, getEvaluationByIdProduct, updateIsReview } from "../controller/evaluation";


const router = express.Router()
router.post("/evaluation", createEvaluation)
router.get("/evaluationByIdProduct/:id", getEvaluationByIdProduct)
router.get("/evaluation", getAllEvaluation)
router.patch("/evaluation/:id", updateIsReview)

export default router
