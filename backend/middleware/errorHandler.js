import { errorResponse } from '../utils/response.js';

// Middleware global para manejo de errores
export const errorHandler = (error, req, res, next) => {
    console.error('🔥 Error capturado por middleware:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Errores de validación
    if (error.message.includes('Datos inválidos') || error.message.includes('Filtros inválidos')) {
        return errorResponse(res, error.message, error, 400);
    }

    // Errores de no encontrado
    if (error.message.includes('no encontrado')) {
        return errorResponse(res, error.message, error, 404);
    }

    // Error de base de datos
    if (error.code) {
        let message = 'Error de base de datos';
        let statusCode = 500;

        switch (error.code) {
            case '23505': // Violación de constraint único
                message = 'El recurso ya existe';
                statusCode = 409;
                break;
            case '23503': // Violación de foreign key
                message = 'Referencia inválida';
                statusCode = 400;
                break;
            case '23514': // Violación de check constraint
                message = 'Datos inválidos para la base de datos';
                statusCode = 400;
                break;
            default:
                message = 'Error interno del servidor';
        }

        return errorResponse(res, message, error, statusCode);
    }

    // Error genérico del servidor
    return errorResponse(res, 'Error interno del servidor', error, 500);
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req, res) => {
    return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, null, 404);
};
