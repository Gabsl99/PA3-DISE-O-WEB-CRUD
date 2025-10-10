import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

async function createAdmin() {
    try {
        // Datos del administrador
        const adminData = {
            username: 'admin',
            email: 'admin@mitienda.com',
            password: 'Admin123',
            role: 'admin'
        };

        // Verificar si el admin ya existe
        const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminData.email);
        
        if (existingAdmin) {
            console.log('⚠️  El usuario admin ya existe');
            console.log('📧 Email:', adminData.email);
            process.exit(0);
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Insertar el administrador
        const stmt = db.prepare(`
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(adminData.username, adminData.email, hashedPassword, adminData.role);

        console.log('✅ Usuario administrador creado exitosamente!');
        console.log('');
        console.log('📋 Credenciales del Administrador:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 Usuario:', adminData.username);
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Contraseña:', adminData.password);
        console.log('🛡️  Rol: Administrador');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
        
    } catch (error) {
        console.error('❌ Error al crear administrador:', error.message);
        process.exit(1);
    } finally {
        db.close();
    }
}

// Ejecutar
createAdmin();
