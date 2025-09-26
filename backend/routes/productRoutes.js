import express from 'express';
import ProductController from '../controllers/ProductController.js';

const router = express.Router();
const productController = new ProductController();

// Rutas CRUD básicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Rutas adicionales
router.get('/category/:category', productController.getProductsByCategory);
router.get('/inventory/low-stock', productController.getLowStockProducts);

export default router;
