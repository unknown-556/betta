import express from "express";
const router=express.Router()
import{ getarticles } from '../../controllers/articleController.js'

router.get("/", getarticles)

export default router