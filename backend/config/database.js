import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear base de datos SQLite
const dbPath = path.join(__dirname, '..', 'database.db');
let db;

export const initDatabase = async () => {
    try {
        db = new Database(dbPath);
        
        // Crear tabla de productos
        db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT,
                stock INTEGER DEFAULT 0,
                image_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla de usuarios (NUEVA)
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME
            );
        `);

        // Insertar datos de prueba de productos
        const insertProduct = db.prepare(`
            INSERT OR IGNORE INTO products (id, name, description, price, category, stock, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insertProduct.run(1, 'Laptop Dell', 'Laptop Dell Inspiron 15 con 8GB RAM', 899.99, 'Tecnología', 10, 'https://example.com/laptop.jpg');
        insertProduct.run(2, 'Smartphone iPhone', 'iPhone 14 Pro Max 256GB', 1299.99, 'Tecnología', 5, 'https://example.com/iphone.jpg');
        insertProduct.run(3, 'Libro Python', 'Aprende Python desde cero', 29.99, 'Educación', 20, 'https://example.com/book.jpg');

        console.log('✅ Base de datos SQLite conectada y tablas creadas');
        return true;
    } catch (error) {
        console.error('❌ Error conectando SQLite:', error.message);
        return false;
    }
};

export const query = async (text, params = []) => {
    try {
        if (text.toLowerCase().trim().startsWith('select')) {
            const stmt = db.prepare(text);
            const rows = stmt.all(params);
            return { rows };
        } else if (text.toLowerCase().includes('insert') && text.toLowerCase().includes('returning')) {
            const insertText = text.replace(/RETURNING \*/gi, '');
            const stmt = db.prepare(insertText);
            const result = stmt.run(params);
            const selectStmt = db.prepare('SELECT * FROM products WHERE id = ?');
            const row = selectStmt.get(result.lastInsertRowid);
            return { rows: [row] };
        } else {
            const stmt = db.prepare(text);
            const result = stmt.run(params);
            return { rowCount: result.changes, lastID: result.lastInsertRowid };
        }
    } catch (error) {
        console.error('❌ Error en query:', error.message);
        throw error;
    }
};

export const testConnection = async () => {
    return await initDatabase();
};

export default db;