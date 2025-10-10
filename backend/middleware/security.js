import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Configuración de Helmet para headers de seguridad
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
});

// Rate limiting para prevenir ataques de fuerza bruta
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por ventana
    message: {
        success: false,
        message: 'Demasiados intentos de login. Por favor intenta en 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting general para la API
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por ventana
    message: {
        success: false,
        message: 'Demasiadas peticiones. Por favor intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware para sanitizar inputs y prevenir XSS
export const sanitizeInput = (req, res, next) => {
    // Sanitizar body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Remover caracteres peligrosos
                req.body[key] = req.body[key]
                    .replace(/[<>]/g, '') // Remover < y >
                    .trim();
            }
        });
    }
    next();
};

// Middleware para logging de seguridad
export const securityLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    next();
};