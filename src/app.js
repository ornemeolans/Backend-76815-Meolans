const express = require('express');
require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const connectDB = require('./config/db');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const Product = require('./models/product.model');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
connectDB();

// Configurar Handlebars
app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Guardar io en app para usarlo en los routers
app.set('io', io);

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Configuracion de Socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('addProduct', async (product) => {
        try {
            const newProduct = await Product.create(product);
            io.emit('productAdded', newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const deleted = await Product.findByIdAndDelete(id);
            if (deleted) io.emit('productDeleted', id);
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
