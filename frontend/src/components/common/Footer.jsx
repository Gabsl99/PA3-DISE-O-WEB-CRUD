import React from 'react';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Mi Tienda</h3>
                        <p>Aplicación web con React + Node.js + PostgreSQL</p>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Tecnologías</h4>
                        <ul>
                            <li>React 18</li>
                            <li>Node.js + Express</li>
                            <li>PostgreSQL</li>
                            <li>Service Layer Architecture</li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Características</h4>
                        <ul>
                            <li>CRUD Completo</li>
                            <li>Consumo de APIs</li>
                            <li>Optimización de Consultas</li>
                            <li>Arquitectura Escalable</li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2025 Proyecto Web - Evaluación Parcial</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
