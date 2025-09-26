# 🛒 Mi Tienda - Sistema de Gestión CRUD

Una aplicación web completa para gestión de productos con funcionalidades CRUD (Create, Read, Update, Delete) desarrollada con tecnologías modernas.

## 📋 Descripción

Este proyecto es un sistema de gestión de productos que permite a los usuarios realizar todas las operaciones CRUD de manera intuitiva a través de una interfaz web moderna y profesional.

## 🚀 Características

- ✅ **CREATE**: Agregar nuevos productos
- ✅ **READ**: Visualizar todos los productos
- ✅ **UPDATE**: Editar productos existentes
- ✅ **DELETE**: Eliminar productos
- ✅ **Interfaz responsiva y moderna**
- ✅ **Validaciones de formulario**
- ✅ **Mensajes de confirmación**
- ✅ **Base de datos persistente**

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **SQLite** - Base de datos
- **better-sqlite3** - Driver de base de datos
- **CORS** - Control de acceso
- **Nodemon** - Desarrollo en tiempo real

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (ES6+)** - Lógica del cliente
- **Fetch API** - Comunicación con el backend

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
git clone [url-del-repositorio]
cd proyecto-web-crud

2. **Instalar dependencias del backend**
cd backend
npm install

3. **La base de datos SQLite se crea automáticamente**

## ▶️ Cómo Ejecutar la Aplicación

### 1. Iniciar el Backend (OBLIGATORIO PRIMERO)
cd backend
npm run dev

**Esperar hasta ver estos mensajes:**
✅ Base de datos SQLite conectada y tablas creadas
🚀 Servidor iniciado en puerto 5000
📍 API disponible en http://localhost:5000/api

### 2. Abrir el Frontend (DESPUÉS)
- Doble clic en `frontend/index.html`
- O usar Live Server en VS Code

## 🌐 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos |
| `GET` | `/api/products/:id` | Obtener producto por ID |
| `POST` | `/api/products` | Crear nuevo producto |
| `PUT` | `/api/products/:id` | Actualizar producto |
| `DELETE` | `/api/products/:id` | Eliminar producto |
| `GET` | `/api/health` | Estado del servidor |

## 📊 Modelo de Datos

### Producto
{
id: INTEGER, // ID único (auto-incremento)
name: TEXT, // Nombre del producto (requerido)
description: TEXT, // Descripción del producto
price: REAL, // Precio (requerido)
category: TEXT, // Categoría del producto
stock: INTEGER, // Cantidad en inventario
image_url: TEXT, // URL de la imagen
created_at: DATETIME, // Fecha de creación
updated_at: DATETIME // Fecha de actualización
}

## 💡 Uso de la Aplicación

### Agregar Producto
1. Llenar el formulario "Agregar Nuevo Producto"
2. Completar nombre, precio y categoría (obligatorios)
3. Opcionalmente agregar stock, URL de imagen y descripción
4. Hacer clic en "Agregar Producto"

### Editar Producto
1. Hacer clic en el botón "✏️ Editar" del producto deseado
2. El formulario se llenará automáticamente
3. Modificar los campos necesarios
4. Hacer clic en "Actualizar Producto"

### Eliminar Producto
1. Hacer clic en el botón "🗑️ Eliminar" del producto deseado
2. Confirmar la eliminación en el diálogo
3. El producto se eliminará permanentemente

## 🎨 Características de la Interfaz

- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Formularios Intuitivos**: Validación en tiempo real
- **Mensajes de Estado**: Confirmaciones y errores claros
- **Categorías Visuales**: Etiquetas de color por categoría
- **Botones de Acción**: Iconos claros para editar y eliminar

## 🔍 Solución de Problemas

### Error de Conexión
Si aparece "Error de conexión":
1. Verificar que el backend esté ejecutándose
2. Comprobar que aparezcan los mensajes de inicio en la terminal
3. Verificar que no haya otros procesos usando el puerto 5000

### Backend no Inicia
Si `npm run dev` falla:
1. Verificar que Node.js esté instalado: `node --version`
2. Reinstalar dependencias: `rm -rf node_modules && npm install`
3. Verificar permisos de escritura en la carpeta del proyecto

## 📝 Notas Importantes

- **Orden de Ejecución**: Siempre iniciar el backend ANTES que el frontend
- **Puerto del Backend**: 5000 (no cambiar sin actualizar el frontend)
- **Base de Datos**: Los datos se guardan automáticamente en `backend/database.db`
- **CORS**: Configurado para permitir conexiones desde `localhost` y `127.0.0.1`

## 🚀 Funcionalidades Futuras

- [ ] Autenticación de usuarios
- [ ] Búsqueda y filtros avanzados
- [ ] Subida de imágenes
- [ ] Categorías personalizadas
- [ ] Reportes y estadísticas
- [ ] API de exportación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

