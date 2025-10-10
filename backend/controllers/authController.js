import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class AuthController {
    // Registro de nuevo usuario
    static async register(req, res) {
        try {
            const { username, email, password, role } = req.body;

            // Validar campos requeridos
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            // Verificar si el usuario ya existe
            const existingUserByEmail = await User.findByEmail(email);
            if (existingUserByEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            const existingUserByUsername = await User.findByUsername(username);
            if (existingUserByUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }

            // Crear nuevo usuario
            const newUser = await User.create({ username, email, password, role });

            // Generar token JWT
            const token = jwt.sign(
                { id: newUser.id, username: newUser.username, role: newUser.role },
                process.env.JWT_SECRET || 'mi_secreto_super_seguro_12345',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: newUser.toJSON(),
                    token
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario',
                error: error.message
            });
        }
    }

    // Login de usuario
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validar campos requeridos
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario por email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Actualizar último login
            await user.updateLastLogin();

            // Generar token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'mi_secreto_super_seguro_12345',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión',
                error: error.message
            });
        }
    }

    // Obtener perfil del usuario autenticado
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: { user: user.toJSON() }
            });
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener perfil',
                error: error.message
            });
        }
    }

    // Obtener todos los usuarios (solo admin)
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            
            res.json({
                success: true,
                data: { users }
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios',
                error: error.message
            });
        }
    }
}

export default AuthController;