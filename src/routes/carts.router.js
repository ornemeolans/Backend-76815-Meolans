const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

// Instanciamos ambos managers
const cartManager = new CartManager('./src/data/carts.json');
const productManager = new ProductManager('./src/data/products.json');

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
});

// RUTA CORREGIDA CON VALIDACIÓN
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    // 1. Verificar si el producto existe en la base de datos de productos
    const productExists = await productManager.getProductById(pid);
    if (!productExists) {
        return res.status(404).json({ error: `El producto con ID ${pid} no existe. No se puede agregar al carrito.` });
    }

    // 2. Si existe, procedemos a agregarlo al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    
    if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
});

module.exports = router;