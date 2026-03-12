const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const manager = new ProductManager('./src/data/products.json');

// Vista home - lista de productos
router.get('/home', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', {
        title: 'Home - Lista de Productos',
        products: products
    });
});

// Vista realTimeProducts - productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realtimeproducts', {
        title: 'Productos en Tiempo Real',
        products: products
    });
});

module.exports = router;

