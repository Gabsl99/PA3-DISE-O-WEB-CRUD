// Middleware de manejo de errores global
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

    // Error de token expirado
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }

    // Error de SQLite
    if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({
            success: false,
            message: 'Error de restricción en la base de datos',
            error: err.message
        });
    }

    // Error genérico
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.originalUrl} no encontrada`
    });
};
