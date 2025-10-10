import jwt from 'jsonwebtoken';

// Middleware para verificar token JWT
export const authenticateToken = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado. Acceso denegado'
            });
        }

        // Verificar token
        jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto_super_seguro_12345', (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token inválido o expirado'
                });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación'
        });
    }
};

// Middleware para verificar rol de administrador
export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere rol de administrador'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos'
        });
    }
};

// Middleware para verificar que el usuario sea el dueño o admin
export const isOwnerOrAdmin = (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        
        if (req.user.id === userId || req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al verificar permisos'
        });
    }
};