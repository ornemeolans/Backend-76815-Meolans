const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// GET /api/products - con paginacion, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            sort,       // 'asc' | 'desc'
            query       // categoria o 'available'
        } = req.query;

        // Construir filtro
        const filter = {};
        if (query) {
            if (query === 'available') {
                filter.status = true;
            } else {
                filter.category = query;
            }
        }

        // Construir ordenamiento
        const sortOption = sort === 'asc'
            ? { price: 1 }
            : sort === 'desc'
            ? { price: -1 }
            : undefined;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        // Links de paginacion
        const baseUrl = '/api/products';
        const buildLink = (p) => {
            const params = new URLSearchParams({ limit, page: p });
            if (sort) params.set('sort', sort);
            if (query) params.set('query', query);
            return `${baseUrl}?${params.toString()}`;
        };

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        product
            ? res.json(product)
            : res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        const io = req.app.get('io');
        if (io) io.emit('productAdded', newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const { _id, ...fields } = req.body;
        const updated = await Product.findByIdAndUpdate(req.params.pid, fields, { new: true });
        updated
            ? res.json(updated)
            : res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (deleted) {
            const io = req.app.get('io');
            if (io) io.emit('productDeleted', req.params.pid);
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
