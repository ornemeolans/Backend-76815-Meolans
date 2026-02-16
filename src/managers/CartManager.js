const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id == id);
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id == cid);
        if (cartIndex === -1) return null;

        const productInCart = carts[cartIndex].products.find(p => p.product == pid);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return carts[cartIndex];
    }
}

module.exports = CartManager;