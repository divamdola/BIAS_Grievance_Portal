const express = require("express");
const { signup, login, getCurrentUser } = require("../controller/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getCurrentUser);

module.exports = router;