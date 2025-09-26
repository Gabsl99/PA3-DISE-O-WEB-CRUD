import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/productService';

const HomePage = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockProducts: 0,
        categories: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [productsResult, lowStockResult] = await Promise.all([
                ProductService.getAllProducts(),
                ProductService.getLowStockProducts()
            ]);

            if (productsResult.success && lowStockResult.success) {
                const products = productsResult.data.products;
                const categories = [...new Set(products.map(p => p.category))];
                
                setStats({
                    totalProducts: products.length,
                    lowStockProducts: lowStockResult.data.products.length,
                    categories
                });
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Bienvenido a Mi Tienda</h1>
                    <p>Sistema de gestión de productos con React y PostgreSQL</p>
                    <Link to="/products" className="cta-button">
                        Ver Productos
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <h2>Características del Sistema</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🛒</div>
                        <h3>CRUD Completo</h3>
                        <p>Crear, leer, actualizar y eliminar productos con validaciones completas.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Búsqueda y Filtros</h3>
                        <p>Busca productos por nombre y filtra por categoría y rango de precios.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Service Layer</h3>
                        <p>Arquitectura con capa de servicio para separar lógica de negocio.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">🗄️</div>
                        <h3>PostgreSQL</h3>
                        <p>Base de datos robusta con consultas optimizadas e índices.</p>
                    </div>
                </div>
            </section>

            {!loading && (
                <section className="stats-section">
                    <h2>Estadísticas del Sistema</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalProducts}</div>
                            <div className="stat-label">Productos Totales</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-number">{stats.categories.length}</div>
                            <div className="stat-label">Categorías</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-number">{stats.lowStockProducts}</div>
                            <div className="stat-label">Stock Bajo</div>
                        </div>
                    </div>
                    
                    {stats.categories.length > 0 && (
                        <div className="categories-list">
                            <h3>Categorías Disponibles:</h3>
                            <div className="categories-tags">
                                {stats.categories.map(category => (
                                    <span key={category} className="category-tag">
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default HomePage;
