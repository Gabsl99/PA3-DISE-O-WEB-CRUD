import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';

// Importar rutas
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Importar middlewares de seguridad
import { securityHeaders, apiLimiter, sanitizeInput, securityLogger } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(securityHeaders); // Helmet para headers de seguridad
app.use(securityLogger); // Logger de seguridad

// Middlewares básicos
app.use(express.json({ limit: '10mb' })); // Limitar tamaño de JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configurado de forma segura
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de sanitización
app.use(sanitizeInput);

// Rate limiting para toda la API
app.use('/api', apiLimiter);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a la API de gestión de productos',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            health: '/api/health'
        }
    });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Inicializar base de datos
        const dbConnected = await initDatabase();
        
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('========================================');
            console.log('🚀 Servidor iniciado exitosamente');
            console.log(`📍 Puerto: ${PORT}`);
            console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
            console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📦 Productos: http://localhost:${PORT}/api/products`);
            console.log(`🔐 Autenticación: http://localhost:${PORT}/api/auth`);
            console.log('========================================');
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar servidor
startServer();

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Error no manejado:', err);
    process.exit(1);
});

export default app;
