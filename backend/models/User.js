import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'user';
        this.created_at = data.created_at;
        this.last_login = data.last_login;
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            // Hash de contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const sql = `
                INSERT INTO users (username, email, password, role)
                VALUES (?, ?, ?, ?)
            `;
            
            const result = await query(sql, [
                userData.username,
                userData.email,
                hashedPassword,
                userData.role || 'user'
            ]);

            const newUser = await User.findById(result.lastID);
            return newUser;
        } catch (error) {
            throw new Error('Error al crear usuario: ' + error.message);
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const result = await query(sql, [email]);
            return result.rows.length > 0 ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const sql = 'SELECT * FROM users WHERE username = ?';
            const result = await query(sql, [username]);
            return result.rows.length > 0 ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const result = await query(sql, [id]);
            return result.rows.length > 0 ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    // Verificar contraseña
    async comparePassword(candidatePassword) {
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            throw new Error('Error al verificar contraseña');
        }
    }

    // Actualizar último login
    async updateLastLogin() {
        try {
            const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
            await query(sql, [this.id]);
        } catch (error) {
            throw new Error('Error al actualizar último login');
        }
    }

    // Obtener todos los usuarios (solo admin)
    static async findAll() {
        try {
            const sql = 'SELECT id, username, email, role, created_at, last_login FROM users ORDER BY created_at DESC';
            const result = await query(sql, []);
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw new Error('Error al obtener usuarios');
        }
    }

    // Método para obtener usuario sin contraseña
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            created_at: this.created_at,
            last_login: this.last_login
        };
    }
}

export default User;