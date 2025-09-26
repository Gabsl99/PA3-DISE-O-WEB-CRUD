-- Crear tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO products (name, description, price, category, stock, image_url) VALUES
('Laptop Dell', 'Laptop Dell Inspiron 15 con 8GB RAM', 899.99, 'Tecnología', 10, 'https://example.com/laptop.jpg'),
('Smartphone iPhone', 'iPhone 14 Pro Max 256GB', 1299.99, 'Tecnología', 5, 'https://example.com/iphone.jpg'),
('Libro Python', 'Aprende Python desde cero', 29.99, 'Educación', 20, 'https://example.com/book.jpg');

-- Crear índices para optimización
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_users_email ON users(email);

