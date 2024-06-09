import express from "express";
const router = express.Router()

import { createArticle, updateArticle } from "../../controllers/postController.js";
import auth from "../../middleware/auth.js";

router.post("/article", auth, createArticle)
router.put("/article/:id", updateArticle);

export default router