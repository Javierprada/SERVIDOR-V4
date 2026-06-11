import express from 'express';
import { uploadMovie } from '../controllers/movieController.js';
const router = express.Router();


// Ruta POST para recibir los datos de inyección
router.post('/upload', uploadMovie);

export default router;