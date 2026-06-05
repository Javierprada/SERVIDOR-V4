import express from 'express';
import { loginAdmin } from '../controllers/authController.js';
import { registrarUsuario } from '../controllers/authRegister.js';
const router = express.Router();

// Desarrollamos la URL final para la petición y repsuesta:
router.post('/login', loginAdmin);
router.post('/register', registrarUsuario);


export default router;