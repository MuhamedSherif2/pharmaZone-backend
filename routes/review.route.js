import express from "express";
const router = express.Router();
import {createreview,getreviews} from "../controllers/review.controller.js";
import { authenticate } from "../middleWars/auth.middlewar.js";
 
// POST → إنشاء ريفيو
router.post("/",authenticate ,createreview);
 
// GET /category → جلب كل الريفيوهات
router.get("/", getreviews);
 
 
export default router;
// {
//   "user": "670e5c12a1b2c3d4e5f67890",
//   "comment": "منتج رائع وخدمة ممتازة!",
//   "rating": 5
// }
 