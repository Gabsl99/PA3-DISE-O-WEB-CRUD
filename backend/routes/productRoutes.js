import express from 'express';
import ProductController from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

// Rutas públicas (sin autenticación requerida)
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Rutas protegidas (requieren autenticación)
// Solo usuarios autenticados pueden crear productos
router.post('/', authenticateToken, validateProduct, ProductController.createProduct);

// Solo administradores pueden actualizar y eliminar productos
router.put('/:id', authenticateToken, isAdmin, validateProduct, ProductController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, ProductController.deleteProduct);

// Ruta de búsqueda (pública)
router.get('/search/:term', ProductController.searchProducts);

export default router;