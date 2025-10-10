import Product from '../models/Product.js';

class ProductController {
    // Obtener todos los productos
    static async getAllProducts(req, res) {
        try {
            const { category, minPrice, maxPrice } = req.query;
            const filters = {};

            if (category) filters.category = category;
            if (minPrice) filters.minPrice = parseFloat(minPrice);
            if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

            const products = await Product.findAll(filters);

            res.json({
                success: true,
                message: 'Productos obtenidos exitosamente',
                data: {
                    products,
                    total: products.length,
                    filters
                }
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    }

    // Obtener producto por ID
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Producto obtenido exitosamente',
                data: { product }
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto',
                error: error.message
            });
        }
    }

    // Crear nuevo producto
    static async createProduct(req, res) {
        try {
            const { name, description, price, category, stock, image_url } = req.body;

            // Validar datos requeridos
            if (!name || !price) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y precio son campos requeridos'
                });
            }

            const productData = {
                name: name.trim(),
                description: description ? description.trim() : null,
                price: parseFloat(price),
                category: category ? category.trim() : null,
                stock: stock ? parseInt(stock) : 0,
                image_url: image_url ? image_url.trim() : null
            };

            const newProduct = await Product.create(productData);

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: { product: newProduct }
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear producto',
                error: error.message
            });
        }
    }

    // Actualizar producto
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            // Sanitizar datos de actualización
            if (updateData.name) updateData.name = updateData.name.trim();
            if (updateData.description) updateData.description = updateData.description.trim();
            if (updateData.category) updateData.category = updateData.category.trim();
            if (updateData.image_url) updateData.image_url = updateData.image_url.trim();
            if (updateData.price) updateData.price = parseFloat(updateData.price);
            if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock);

            const updatedProduct = await product.update(updateData);

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: { product: updatedProduct }
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar producto',
                error: error.message
            });
        }
    }

    // Eliminar producto
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            const deleted = await product.delete();

            if (deleted) {
                res.json({
                    success: true,
                    message: 'Producto eliminado exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar producto'
                });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar producto',
                error: error.message
            });
        }
    }

    // Buscar productos por nombre
    static async searchProducts(req, res) {
        try {
            const { term } = req.params;

            if (!term || term.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'El término de búsqueda debe tener al menos 2 caracteres'
                });
            }

            const products = await Product.searchByName(term);

            res.json({
                success: true,
                message: 'Búsqueda completada',
                data: {
                    products,
                    total: products.length,
                    searchTerm: term
                }
            });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar productos',
                error: error.message
            });
        }
    }
}

export default ProductController;