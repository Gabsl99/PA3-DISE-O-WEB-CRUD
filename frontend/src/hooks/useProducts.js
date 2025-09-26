import { useState, useEffect, useCallback } from 'react';
import ProductService from '../services/productService';

export const useProducts = (initialFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    // Cargar productos
    const loadProducts = useCallback(async (customFilters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const appliedFilters = { ...filters, ...customFilters };
            const result = await ProductService.getAllProducts(appliedFilters);

            if (result.success) {
                setProducts(result.data.products || []);
            } else {
                setError(result.error);
                setProducts([]);
            }
        } catch (err) {
            setError('Error inesperado al cargar productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Crear producto
    const createProduct = async (productData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await ProductService.createProduct(productData);

            if (result.success) {
                await loadProducts(); // Recargar lista
                return result;
            } else {
                setError(result.error);
                return result;
            }
        } catch (err) {
            const errorMsg = 'Error inesperado al crear producto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar producto
    const updateProduct = async (id, updateData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await ProductService.updateProduct(id, updateData);

            if (result.success) {
                await loadProducts(); // Recargar lista
                return result;
            } else {
                setError(result.error);
                return result;
            }
        } catch (err) {
            const errorMsg = 'Error inesperado al actualizar producto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const result = await ProductService.deleteProduct(id);

            if (result.success) {
                await loadProducts(); // Recargar lista
                return result;
            } else {
                setError(result.error);
                return result;
            }
        } catch (err) {
            const errorMsg = 'Error inesperado al eliminar producto';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Buscar productos
    const searchProducts = async (searchTerm) => {
        await loadProducts({ search: searchTerm });
    };

    // Aplicar filtros
    const applyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({});
    };

    // Cargar productos al montar el componente o cambiar filtros
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        loading,
        error,
        filters,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        applyFilters,
        clearFilters,
        setError
    };
};

export default useProducts;
