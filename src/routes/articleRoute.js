import express from "express";
const router=express.Router()
import{ getarticles, getArticle, getarticle } from '../controllers/articleController.js'
import auth from "../middleware/auth.js";

router.get("/", getarticles)
router.get('/articles', auth,  getArticle);
router.get("/:id", getarticle)

export default router