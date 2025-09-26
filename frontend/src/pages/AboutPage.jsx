import React from 'react';

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <h1>Acerca del Proyecto</h1>
                
                <section className="about-section">
                    <h2>Descripción</h2>
                    <p>
                        Este proyecto es una aplicación web completa desarrollada con React, Node.js, Express y PostgreSQL.
                        Implementa una arquitectura de capas con Service Layer que separa la lógica de negocio de la presentación
                        y el acceso a datos.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Tecnologías Utilizadas</h2>
                    
                    <div className="tech-stack">
                        <div className="tech-category">
                            <h3>Frontend</h3>
                            <ul>
                                <li>React 18 con Hooks</li>
                                <li>React Router para navegación</li>
                                <li>Axios para consumo de APIs</li>
                                <li>CSS3 con diseño responsive</li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h3>Backend</h3>
                            <ul>
                                <li>Node.js con ES Modules</li>
                                <li>Express.js como framework web</li>
                                <li>PostgreSQL como base de datos</li>
                                <li>Service Layer architecture</li>
                                <li>Joi para validaciones</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Arquitectura</h2>
                    
                    <div className="architecture-description">
                        <h3>Service Layer</h3>
                        <p>
                            La aplicación implementa una capa de servicio tanto en el backend como en el frontend:
                        </p>
                        
                        <ul>
                            <li><strong>Backend Service Layer:</strong> ProductService.js maneja toda la lógica de negocio, 
                            validaciones y comunicación con la base de datos.</li>
                            
                            <li><strong>Frontend Service Layer:</strong> productService.js gestiona todas las llamadas HTTP 
                            al API, manejo de errores y transformación de datos.</li>
                            
                            <li><strong>Custom Hooks:</strong> useProducts.js encapsula la lógica de estado y operaciones 
                            CRUD para los componentes React.</li>
                        </ul>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Funcionalidades</h2>
                    
                    <div className="features-list">
                        <div className="feature-item">
                            <h4>🛒 CRUD Completo</h4>
                            <p>Crear, leer, actualizar y eliminar productos con validaciones completas</p>
                        </div>
                        
                        <div className="feature-item">
                            <h4>🔍 Búsqueda y Filtros</h4>
                            <p>Búsqueda por nombre y filtros por categoría y rango de precios</p>
                        </div>
                        
                        <div className="feature-item">
                            <h4>📊 Gestión de Inventario</h4>
                            <p>Control de stock con alertas para productos con inventario bajo</p>
                        </div>
                        
                        <div className="feature-item">
                            <h4>⚡ Consultas Optimizadas</h4>
                            <p>Índices en PostgreSQL y queries parametrizadas para mejor rendimiento</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Optimizaciones Implementadas</h2>
                    
                    <ul>
                        <li>Índices en campos frecuentemente consultados (categoría, nombre)</li>
                        <li>Queries parametrizadas para prevenir inyección SQL</li>
                        <li>Connection pooling para manejo eficiente de conexiones</li>
                        <li>Interceptores de Axios para manejo centralizado de requests/responses</li>
                        <li>Manejo de errores centralizado tanto en frontend como backend</li>
                        <li>Validaciones tanto en cliente como servidor</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Estructura del Proyecto</h2>
                    <p>
                        El proyecto sigue una estructura modular y escalable con separación clara de responsabilidades:
                    </p>
                    
                    <div className="project-structure">
                        <div className="structure-item">
                            <strong>Backend:</strong> Config, Models, Services, Controllers, Routes
                        </div>
                        <div className="structure-item">
                            <strong>Frontend:</strong> Components, Pages, Services, Hooks, Styles
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
