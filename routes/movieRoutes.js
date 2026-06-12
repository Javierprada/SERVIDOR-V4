import express from 'express';
import { getMoviesForDashboard, uploadMovie } from '../controllers/movieController.js';
const router = express.Router();


// Ruta POST para recibir los datos de inyección
router.post('/upload', uploadMovie);

// RUTA GET que llamara el dashboard del usuario
router.get('/movies', getMoviesForDashboard);

export default router;