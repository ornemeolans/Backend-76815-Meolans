const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await manager.addProduct(req.body);
        
        // Obtener io desde app y emitir evento a todos los clientes
        const io = req.app.get('io');
        if (io) {
            io.emit('productAdded', newProduct);
        }
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    updated ? res.json(updated) : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete('/:pid', async (req, res) => {
    const deleted = await manager.deleteProduct(req.params.pid);
    
    if (deleted) {
        // Obtener io desde app y emitir evento a todos los clientes
        const io = req.app.get('io');
        if (io) {
            io.emit('productDeleted', parseInt(req.params.pid));
        }
        
        res.json({ message: "Producto eliminado" });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

module.exports = router;

