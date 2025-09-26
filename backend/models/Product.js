import { query } from '../config/database.js';

class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.category = data.category;
        this.stock = data.stock;
        this.image_url = data.image_url;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Obtener todos los productos
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM products';
        const params = [];
        const conditions = [];

        if (filters.category) {
            conditions.push('category = ?');
            params.push(filters.category);
        }

        if (filters.minPrice) {
            conditions.push('price >= ?');
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            conditions.push('price <= ?');
            params.push(filters.maxPrice);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY created_at DESC';

        const result = await query(sql, params);
        return result.rows.map(row => new Product(row));
    }

    // Obtener por ID
    static async findById(id) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const result = await query(sql, [id]);
        return result.rows.length > 0 ? new Product(result.rows[0]) : null;
    }

    // Crear producto
    static async create(productData) {
        const sql = `
            INSERT INTO products (name, description, price, category, stock, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            productData.name,
            productData.description,
            productData.price,
            productData.category,
            productData.stock || 0,
            productData.image_url
        ];

        const result = await query(sql + ' RETURNING *', values);
        return new Product(result.rows[0]);
    }

    // Actualizar producto
    async update(updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(this.id);

        const sql = `
            UPDATE products 
            SET ${fields.join(', ')}
            WHERE id = ?
        `;

        await query(sql, values);
        
        // Obtener producto actualizado
        const updated = await Product.findById(this.id);
        Object.assign(this, updated);
        return this;
    }

    // Eliminar producto
    async delete() {
        const sql = 'DELETE FROM products WHERE id = ?';
        const result = await query(sql, [this.id]);
        return result.rowCount > 0;
    }

    // Buscar por nombre
    static async searchByName(searchTerm) {
        const sql = 'SELECT * FROM products WHERE name LIKE ? ORDER BY name';
        const result = await query(sql, [`%${searchTerm}%`]);
        return result.rows.map(row => new Product(row));
    }
}

export default Product;