import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { loginLimiter } from '../middleware/security.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, AuthController.register);
router.post('/login', loginLimiter, validateLogin, AuthController.login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, AuthController.getProfile);

// Rutas solo para administradores
router.get('/users', authenticateToken, isAdmin, AuthController.getAllUsers);

export default router;