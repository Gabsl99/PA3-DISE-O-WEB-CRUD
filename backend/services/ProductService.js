import Product from '../models/Product.js';
import Joi from 'joi';

class ProductService {
    // Esquemas de validación
    static createProductSchema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().max(1000).allow(''),
        price: Joi.number().positive().precision(2).required(),
        category: Joi.string().max(100).required(),
        stock: Joi.number().integer().min(0).default(0),
        image_url: Joi.string().uri().allow('')
    });

    static updateProductSchema = Joi.object({
        name: Joi.string().min(3).max(255),
        description: Joi.string().max(1000),
        price: Joi.number().positive().precision(2),
        category: Joi.string().max(100),
        stock: Joi.number().integer().min(0),
        image_url: Joi.string().uri().allow('')
    }).min(1);

    static filterSchema = Joi.object({
        category: Joi.string().max(100),
        minPrice: Joi.number().positive(),
        maxPrice: Joi.number().positive(),
        search: Joi.string().max(255)
    });

    // Obtener todos los productos con filtros
    async getAllProducts(filters = {}) {
        try {
            // Validar filtros
            const { error, value } = ProductService.filterSchema.validate(filters);
            if (error) {
                throw new Error(`Filtros inválidos: ${error.details[0].message}`);
            }

            // Si hay búsqueda por nombre, usar método específico
            if (value.search) {
                return await Product.searchByName(value.search);
            }

            return await Product.findAll(value);
        } catch (error) {
            console.error('Error en ProductService.getAllProducts:', error);
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido');
            }

            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            console.error('Error en ProductService.getProductById:', error);
            throw error;
        }
    }

    // Crear nuevo producto
    async createProduct(productData) {
        try {
            // Validar datos de entrada
            const { error, value } = ProductService.createProductSchema.validate(productData);
            if (error) {
                throw new Error(`Datos inválidos: ${error.details[0].message}`);
            }

            // Lógica de negocio adicional
            if (value.price > 10000) {
                console.log('⚠️  Producto de alto valor creado:', value.name);
            }

            const newProduct = await Product.create(value);
            console.log('✅ Producto creado exitosamente:', newProduct.id);
            return newProduct;
        } catch (error) {
            console.error('Error en ProductService.createProduct:', error);
            throw new Error('Error al crear producto: ' + error.message);
        }
    }

    // Actualizar producto
    async updateProduct(id, updateData) {
        try {
            // Validar ID
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido');
            }

            // Validar datos de actualización
            const { error, value } = ProductService.updateProductSchema.validate(updateData);
            if (error) {
                throw new Error(`Datos inválidos: ${error.details[0].message}`);
            }

            // Obtener producto existente
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Lógica de negocio
            if (value.stock !== undefined && value.stock < 5) {
                console.log('⚠️  Producto con stock bajo:', product.name);
            }

            const updatedProduct = await product.update(value);
            console.log('✅ Producto actualizado exitosamente:', updatedProduct.id);
            return updatedProduct;
        } catch (error) {
            console.error('Error en ProductService.updateProduct:', error);
            throw error;
        }
    }

    // Eliminar producto
    async deleteProduct(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido');
            }

            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Lógica de negocio antes de eliminar
            if (product.stock > 0) {
                console.log('⚠️  Eliminando producto con stock:', product.name);
            }

            const deleted = await product.delete();
            if (!deleted) {
                throw new Error('Error al eliminar producto');
            }

            console.log('✅ Producto eliminado exitosamente:', id);
            return { message: 'Producto eliminado exitosamente' };
        } catch (error) {
            console.error('Error en ProductService.deleteProduct:', error);
            throw error;
        }
    }

    // Métodos adicionales de negocio
    async getProductsByCategory(category) {
        return await this.getAllProducts({ category });
    }

    async getProductsInPriceRange(minPrice, maxPrice) {
        return await this.getAllProducts({ minPrice, maxPrice });
    }

    async getLowStockProducts(threshold = 5) {
        const allProducts = await Product.findAll();
        return allProducts.filter(product => product.stock < threshold);
    }
}

export default ProductService;
