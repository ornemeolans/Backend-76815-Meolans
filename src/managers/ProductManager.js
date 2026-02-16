const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    async addProduct(product) {
        const { title, description, code, price, status = true, stock, category, thumbnails = [] } = product;
        
        // Validación de campos obligatorios
        if (!title || !description || !code || !price || stock === undefined || !category) {
            throw new Error("Todos los campos son obligatorios, excepto thumbnails.");
        }

        const products = await this.getProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title, description, code, price, status, stock, category, thumbnails
        };

        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id == id);
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return null;

        const { id: _, ...rest } = updatedFields; // Protegemos el ID
        products[index] = { ...products[index], ...rest };
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.id != id);
        if (products.length === filtered.length) return false;
        await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, '\t'));
        return true;
    }
}

module.exports = ProductManager;