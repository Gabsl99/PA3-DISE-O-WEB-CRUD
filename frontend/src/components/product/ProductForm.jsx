import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Llenar formulario si estamos editando
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                stock: product.stock || '',
                image_url: product.image_url || ''
            });
        }
    }, [product]);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando se modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        } else if (formData.name.length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'La categoría es requerida';
        }

        if (formData.stock && parseInt(formData.stock) < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
        }

        if (formData.image_url && !isValidUrl(formData.image_url)) {
            newErrors.image_url = 'La URL de la imagen no es válida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validar URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Preparar datos para envío
            const dataToSend = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0
            };

            const result = await onSave(dataToSend);

            if (!result.success) {
                // Mostrar errores del servidor
                if (result.details && result.details.error) {
                    setErrors({ general: result.error });
                } else {
                    setErrors({ general: result.error || 'Error al guardar el producto' });
                }
            }
        } catch (error) {
            setErrors({ general: 'Error inesperado al guardar el producto' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form">
            <div className="form-header">
                <h3>{product ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
                <button 
                    onClick={onCancel} 
                    className="close-btn"
                    disabled={loading}
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
                {/* Error general */}
                {errors.general && (
                    <div className="error-message">
                        {errors.general}
                    </div>
                )}

                {/* Nombre */}
                <div className="form-group">
                    <label htmlFor="name">
                        Nombre del Producto *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Ingresa el nombre del producto"
                        disabled={loading}
                        maxLength={255}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                {/* Descripción */}
                <div className="form-group">
                    <label htmlFor="description">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        placeholder="Describe el producto..."
                        disabled={loading}
                        maxLength={1000}
                        rows={4}
                    />
                    <small>{formData.description.length}/1000 caracteres</small>
                    {errors.description && <span className="field-error">{errors.description}</span>}
                </div>

                {/* Precio y Stock */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">
                            Precio (S/) *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`form-input ${errors.price ? 'error' : ''}`}
                            placeholder="0.00"
                            disabled={loading}
                            step="0.01"
                            min="0"
                        />
                        {errors.price && <span className="field-error">{errors.price}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="stock">
                            Stock
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={`form-input ${errors.stock ? 'error' : ''}`}
                            placeholder="0"
                            disabled={loading}
                            min="0"
                        />
                        {errors.stock && <span className="field-error">{errors.stock}</span>}
                    </div>
                </div>

                {/* Categoría */}
                <div className="form-group">
                    <label htmlFor="category">
                        Categoría *
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`form-select ${errors.category ? 'error' : ''}`}
                        disabled={loading}
                    >
                        <option value="">Selecciona una categoría</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Educación">Educación</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Salud">Salud</option>
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                </div>

                {/* URL de imagen */}
                <div className="form-group">
                    <label htmlFor="image_url">
                        URL de la Imagen
                    </label>
                    <input
                        type="url"
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className={`form-input ${errors.image_url ? 'error' : ''}`}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        disabled={loading}
                    />
                    {errors.image_url && <span className="field-error">{errors.image_url}</span>}
                    
                    {/* Preview de imagen */}
                    {formData.image_url && isValidUrl(formData.image_url) && (
                        <div className="image-preview">
                            <img 
                                src={formData.image_url} 
                                alt="Preview"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner">⏳</span>
                                {product ? 'Actualizando...' : 'Creando...'}
                            </>
                        ) : (
                            product ? 'Actualizar' : 'Crear'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
