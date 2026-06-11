import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/forgotPassword.js';
const router = express.Router();


// ENDPOINTS
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;