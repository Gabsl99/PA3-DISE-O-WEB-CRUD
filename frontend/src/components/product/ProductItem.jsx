import React from 'react';

const ProductItem = ({ product, onEdit, onDelete }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-PE');
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Sin stock', class: 'stock-out' };
        if (stock < 5) return { text: 'Stock bajo', class: 'stock-low' };
        return { text: 'En stock', class: 'stock-ok' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <div className="product-item">
            <div className="product-image">
                {product.image_url ? (
                    <img 
                        src={product.image_url} 
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                        }}
                    />
                ) : (
                    <div className="image-placeholder">
                        <span>📦</span>
                    </div>
                )}
            </div>

            <div className="product-content">
                <div className="product-header">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-category">{product.category}</span>
                </div>

                <div className="product-description">
                    <p>{product.description || 'Sin descripción disponible'}</p>
                </div>

                <div className="product-details">
                    <div className="price-section">
                        <span className="price">{formatPrice(product.price)}</span>
                    </div>

                    <div className="stock-section">
                        <span className={`stock-badge ${stockStatus.class}`}>
                            {stockStatus.text} ({product.stock} unidades)
                        </span>
                    </div>
                </div>

                <div className="product-meta">
                    <small>ID: {product.id}</small>
                    <small>Creado: {formatDate(product.created_at)}</small>
                    {product.updated_at !== product.created_at && (
                        <small>Actualizado: {formatDate(product.updated_at)}</small>
                    )}
                </div>

                <div className="product-actions">
                    <button
                        onClick={() => onEdit(product)}
                        className="btn btn-edit"
                        title="Editar producto"
                    >
                        ✏️ Editar
                    </button>
                    
                    <button
                        onClick={() => onDelete(product.id)}
                        className="btn btn-delete"
                        title="Eliminar producto"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
