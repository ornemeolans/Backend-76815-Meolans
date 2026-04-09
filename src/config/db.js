const mongoose = require('mongoose');

// Reemplazar con tu URI de MongoDB Atlas o local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
