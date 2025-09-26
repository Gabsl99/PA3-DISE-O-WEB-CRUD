import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuración global de axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
});

// Interceptor para requests
apiClient.interceptors.request.use(
    (config) => {
        console.log('📤 Enviando request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Error en request:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 Response recibido:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Error en response:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

class ProductService {
    // Obtener todos los productos con filtros
    static async getAllProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '') {
                    queryParams.append(key, filters[key]);
                }
            });

            const url = `/products${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await apiClient.get(url);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener productos',
                details: error.response?.data
            };
        }
    }

    // Obtener producto por ID
    static async getProductById(id) {
        try {
            if (!id) {
                throw new Error('ID de producto requerido');
            }

            const response = await apiClient.get(`/products/${id}`);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener producto',
                details: error.response?.data
            };
        }
    }

    // Crear nuevo producto
    static async createProduct(productData) {
        try {
            // Validación básica en el cliente
            if (!productData.name || !productData.price || !productData.category) {
                throw new Error('Nombre, precio y categoría son requeridos');
            }

            const response = await apiClient.post('/products', productData);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear producto',
                details: error.response?.data
            };
        }
    }

    // Actualizar producto
    static async updateProduct(id, updateData) {
        try {
            if (!id) {
                throw new Error('ID de producto requerido');
            }

            // Filtrar campos vacíos
            const filteredData = Object.keys(updateData).reduce((acc, key) => {
                if (updateData[key] !== '' && updateData[key] !== undefined) {
                    acc[key] = updateData[key];
                }
                return acc;
            }, {});

            const response = await apiClient.put(`/products/${id}`, filteredData);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar producto',
                details: error.response?.data
            };
        }
    }

    // Eliminar producto
    static async deleteProduct(id) {
        try {
            if (!id) {
                throw new Error('ID de producto requerido');
            }

            const response = await apiClient.delete(`/products/${id}`);
            
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar producto',
                details: error.response?.data
            };
        }
    }

    // Obtener productos por categoría
    static async getProductsByCategory(category) {
        return await this.getAllProducts({ category });
    }

    // Buscar productos
    static async searchProducts(searchTerm) {
        return await this.getAllProducts({ search: searchTerm });
    }

    // Obtener productos con stock bajo
    static async getLowStockProducts(threshold = 5) {
        try {
            const response = await apiClient.get(`/products/inventory/low-stock?threshold=${threshold}`);
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener productos con stock bajo',
                details: error.response?.data
            };
        }
    }

    // Método para manejo de errores de red
    static handleNetworkError(error) {
        if (!navigator.onLine) {
            return 'Sin conexión a internet. Verifica tu conexión.';
        }

        if (error.code === 'ECONNABORTED') {
            return 'La solicitud tardó demasiado. Intenta nuevamente.';
        }

        return 'Error de conexión. Verifica que el servidor esté funcionando.';
    }
}

export default ProductService;
