const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// POST /api/carts - crear carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// GET /api/carts/:cid - traer carrito con populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        cart
            ? res.json(cart.products)
            : res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// POST /api/carts/:cid/products/:pid - agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const productExists = await Product.findById(pid);
        if (!productExists) {
            return res.status(404).json({ status: 'error', error: `Producto con ID ${pid} no existe` });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const item = cart.products.find(p => p.product.toString() === pid);
        if (item) {
            item.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid - eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// PUT /api/carts/:cid - reemplazar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body; // Array de { product: id, quantity: n }
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products },
            { new: true }
        ).populate('products.product');

        cart
            ? res.json(cart)
            : res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid - actualizar solo cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ status: 'error', error: 'La cantidad debe ser mayor a 0' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const item = cart.products.find(p => p.product.toString() === pid);
        if (!item) return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });

        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/carts/:cid - vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );
        cart
            ? res.json({ message: 'Carrito vaciado', cart })
            : res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
