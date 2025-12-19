// controllers/review.controller.js
import Review from "../models/review.model.js";
 
// إنشاء ريفيو جديدة
export const createreview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
 
    // التأكد من وجود التقييم
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
 
    const newReview = await Review.create({
      user: req.user.id, // من الـ middleware
      comment,
      rating
    });
 
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
// جلب كل الريفيوهات (مع اسم المستخدم)
export const getreviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
 