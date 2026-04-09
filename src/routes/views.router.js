const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

// Redirigir raíz al home
router.get('/', (req, res) => {
    res.redirect('/home');
});

// Vista /products - lista paginada de productos
router.get('/products', async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = req.query;

        const filter = {};
        if (query) {
            if (query === 'available') {
                filter.status = true;
            } else {
                filter.category = query;
            }
        }

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

        const buildLink = (p) => {
            const params = new URLSearchParams({ limit, page: p });
            if (sort) params.set('sort', sort);
            if (query) params.set('query', query);
            return `/products?${params.toString()}`;
        };

        res.render('index', {
            title: 'Productos',
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
            currentSort: sort || '',
            currentQuery: query || ''
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// Vista /products/:pid - detalle del producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).render('error', { error: 'Producto no encontrado' });
        res.render('productDetail', { title: product.title, product });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// Vista /carts/:cid - detalle del carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).render('error', { error: 'Carrito no encontrado' });
        res.render('cart', {
            title: 'Mi Carrito',
            cartId: req.params.cid,
            products: cart.products
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// Vista home
router.get('/home', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('home', { title: 'Home - Lista de Productos', products });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// Vista realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('realtimeproducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

module.exports = router;
