const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");
const { authenticate } = require("../middleWars/auth.middlewar");

// All require login
router.get("/", authenticate, user.getProfile);
router.put("/update", authenticate, user.updateProfile);
router.put("/update-password", authenticate, user.updatePassword);

module.exports = router;
