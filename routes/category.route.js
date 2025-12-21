import express from "express";
const router = express.Router();
import upload from '../middleWars/upload.middleware.js';

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory
} from "../controllers/category.controller.js";

router.post("/",upload.single("imageUrl"), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("imageUrl"),updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/restore/:id", restoreCategory);


export default router;