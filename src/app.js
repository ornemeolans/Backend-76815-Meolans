const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Guardar io en app para usarlo en los routers
app.set('io', io);

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Inicializar ProductManager
const manager = new ProductManager('./src/data/products.json');

// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Escuchar evento para agregar producto
    socket.on('addProduct', async (product) => {
        try {
            const newProduct = await manager.addProduct(product);
            // Emitir a todos los clientes el nuevo producto
            io.emit('productAdded', newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });

    // Escuchar evento para eliminar producto
    socket.on('deleteProduct', async (id) => {
        try {
            const deleted = await manager.deleteProduct(id);
            if (deleted) {
                // Emitir a todos los clientes el producto eliminado
                io.emit('productDeleted', id);
            }
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

