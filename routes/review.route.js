const express = require("express");
const router = express.Router();
const {
  createreview,
getreviews,
 
} = require("../controllers/review.controller");
const { authenticate } = require("../middleWars/auth.middlewar");
 
// POST → إنشاء ريفيو
router.post("/",authenticate ,createreview);
 
// GET /category → جلب كل الريفيوهات
router.get("/", getreviews);
 
 
 
 
 
module.exports = router;
// {
//   "user": "670e5c12a1b2c3d4e5f67890",
//   "comment": "منتج رائع وخدمة ممتازة!",
//   "rating": 5
// }
 