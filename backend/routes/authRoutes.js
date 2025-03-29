// routes/authRoutes.js
import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
const router = express.Router();

// Signup Route
router.post('/signup', signupUser);

// Login Route
router.post('/login', loginUser);



export default router;
