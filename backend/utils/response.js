// Utilidad para respuestas estándar de la API
export const successResponse = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, error = null, statusCode = 400) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
        response.error = {
            details: error.message,
            stack: error.stack
        };
    }

    return res.status(statusCode).json(response);
};
