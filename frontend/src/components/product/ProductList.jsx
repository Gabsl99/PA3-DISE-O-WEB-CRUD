import React, { useState } from 'react';
import ProductItem from './ProductItem';
import ProductForm from './ProductForm';
import Loading from '../common/Loading';
import useProducts from '../../hooks/useProducts';

const ProductList = () => {
    const {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        applyFilters,
        clearFilters,
        setError
    } = useProducts();

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Manejar búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(searchTerm);
    };

    // Manejar filtros
    const handleApplyFilters = () => {
        const filters = {};
        
        if (categoryFilter) filters.category = categoryFilter;
        if (priceRange.min) filters.minPrice = priceRange.min;
        if (priceRange.max) filters.maxPrice = priceRange.max;

        applyFilters(filters);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setCategoryFilter('');
        setPriceRange({ min: '', max: '' });
        setSearchTerm('');
        clearFilters();
    };

    // Manejar creación/edición
    const handleSaveProduct = async (productData) => {
        let result;
        
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }

        if (result.success) {
            setShowForm(false);
            setEditingProduct(null);
        }

        return result;
    };

    // Manejar eliminación
    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            await deleteProduct(id);
        }
    };

    // Manejar edición
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    // Cerrar formulario
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    // Limpiar error
    const handleClearError = () => {
        setError(null);
    };

    if (loading && products.length === 0) return <Loading />;

    return (
        <div className="product-list-container">
            <div className="header-section">
                <h2>Gestión de Productos</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Agregar Producto
                </button>
            </div>

            {/* Sección de filtros y búsqueda */}
            <div className="filters-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-secondary">
                        Buscar
                    </button>
                </form>

                <div className="filters-group">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas las categorías</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Educación">Educación</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Deportes">Deportes</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Precio mín"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="filter-input"
                    />

                    <input
                        type="number"
                        placeholder="Precio máx"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="filter-input"
                    />

                    <button onClick={handleApplyFilters} className="btn btn-outline">
                        Aplicar Filtros
                    </button>

                    <button onClick={handleClearFilters} className="btn btn-outline">
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Mostrar errores */}
            {error && (
                <div className="error-message">
                    <span>{error}</span>
                    <button onClick={handleClearError} className="error-close">
                        ×
                    </button>
                </div>
            )}

            {/* Loading durante operaciones */}
            {loading && products.length > 0 && (
                <div className="loading-overlay">
                    <Loading />
                </div>
            )}

            {/* Información de resultados */}
            <div className="results-info">
                <span>Mostrando {products.length} productos</span>
            </div>

            {/* Lista de productos */}
            <div className="products-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="no-products">
                            <p>No se encontraron productos</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowForm(true)}
                            >
                                Agregar el primer producto
                            </button>
                        </div>
                    )
                )}
            </div>

            {/* Modal del formulario */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ProductForm
                            product={editingProduct}
                            onSave={handleSaveProduct}
                            onCancel={handleCloseForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
