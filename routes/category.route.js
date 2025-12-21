import express from "express";
const router = express.Router();
import upload from '../middleWars/upload.middleware.js';
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";
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
router.delete("/:id", authenticate,authorize('pharmacy'),deleteCategory);
router.patch("/restore/:categoryId",authenticate,authorize('pharmacy'), restoreCategory);


export default router;