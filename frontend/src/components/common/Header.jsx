import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <h1>🛒 Mi Tienda</h1>
                </Link>

                <nav className="main-nav">
                    <Link 
                        to="/" 
                        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
                    >
                        Inicio
                    </Link>
                    <Link 
                        to="/products" 
                        className={location.pathname === '/products' ? 'nav-link active' : 'nav-link'}
                    >
                        Productos
                    </Link>
                    <Link 
                        to="/about" 
                        className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}
                    >
                        Acerca de
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
