import { body, validationResult } from 'express-validator';

// Middleware para validar errores
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array()
        });
    }
    next();
};

// Validaciones para registro
export const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    
    validate
];

// Validaciones para login
export const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
    
    validate
];

// Validaciones para productos
export const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del producto es requerido')
        .isLength({ max: 200 })
        .withMessage('El nombre no puede exceder 200 caracteres')
        .escape(), // Prevenir XSS
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres')
        .escape(),
    
    body('price')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número positivo'),
    
    body('category')
        .optional()
        .trim()
        .escape(),
    
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un número entero positivo'),
    
    body('image_url')
        .optional()
        .trim()
        .isURL()
        .withMessage('La URL de imagen debe ser válida'),
    
    validate
];