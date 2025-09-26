import ProductService from '../services/ProductService.js';
import { successResponse, errorResponse } from '../utils/response.js';

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    // Obtener todos los productos
    getAllProducts = async (req, res, next) => {
        try {
            const filters = {
                category: req.query.category,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
                search: req.query.search
            };

            const products = await this.productService.getAllProducts(filters);
            
            return successResponse(res, 'Productos obtenidos exitosamente', {
                products,
                total: products.length,
                filters: Object.keys(filters).reduce((acc, key) => {
                    if (filters[key] !== undefined) acc[key] = filters[key];
                    return acc;
                }, {})
            });
        } catch (error) {
            next(error);
        }
    };

    // Obtener producto por ID
    getProductById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(parseInt(id));
            
            return successResponse(res, 'Producto obtenido exitosamente', { product });
        } catch (error) {
            next(error);
        }
    };

    // Crear nuevo producto
    createProduct = async (req, res, next) => {
        try {
            const productData = req.body;
            const newProduct = await this.productService.createProduct(productData);
            
            return successResponse(res, 'Producto creado exitosamente', { product: newProduct }, 201);
        } catch (error) {
            next(error);
        }
    };

    // Actualizar producto
    updateProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const updatedProduct = await this.productService.updateProduct(parseInt(id), updateData);
            
            return successResponse(res, 'Producto actualizado exitosamente', { product: updatedProduct });
        } catch (error) {
            next(error);
        }
    };

    // Eliminar producto
    deleteProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.productService.deleteProduct(parseInt(id));
            
            return successResponse(res, result.message, null, 200);
        } catch (error) {
            next(error);
        }
    };

    // Métodos adicionales
    getProductsByCategory = async (req, res, next) => {
        try {
            const { category } = req.params;
            const products = await this.productService.getProductsByCategory(category);
            
            return successResponse(res, `Productos de la categoría ${category}`, { 
                products, 
                category, 
                total: products.length 
            });
        } catch (error) {
            next(error);
        }
    };

    getLowStockProducts = async (req, res, next) => {
        try {
            const threshold = req.query.threshold ? parseInt(req.query.threshold) : 5;
            const products = await this.productService.getLowStockProducts(threshold);
            
            return successResponse(res, 'Productos con stock bajo', { 
                products, 
                threshold,
                total: products.length 
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ProductController;
