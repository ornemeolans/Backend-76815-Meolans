# 🛒 Backend eCommerce - Entrega Final

Este proyecto es una aplicación de servidor robusta para un eCommerce, desarrollada con **Node.js** y **Express**. Implementa persistencia de datos en **MongoDB** y comunicación en tiempo real mediante **Socket.io**.

## 🚀 Características Principales

* **Persistencia en MongoDB**: Migración completa de sistema de archivos JSON a una base de datos NoSQL escalable.
* **Paginación Avanzada**: El listado de productos cuenta con filtros por categoría o disponibilidad, ordenamiento por precio y navegación paginada.
* **Carrito de Compras**: Gestión completa de carritos con funciones para agregar, eliminar y actualizar cantidades, utilizando `populate` para desglosar la información de los productos.
* **Real-Time**: Actualización automática de la lista de productos mediante WebSockets cuando se agrega o elimina un ítem.
* **Motor de Plantillas**: Interfaz dinámica generada con **Handlebars**.

## 🛠️ Tecnologías Utilizadas

* **Runtime**: Node.js
* **Framework**: Express (v5.2.1)
* **Base de Datos**: MongoDB & Mongoose
* **Paginación**: mongoose-paginate-v2
* **Vistas**: Express-Handlebars (v8.0.6)
* **Comunicación**: Socket.io (v4.8.3)

## 📋 Requisitos Previos

1.  Tener instalado **Node.js** (versión 18 o superior recomendada).
2.  Tener una instancia de **MongoDB** (local o en MongoDB Atlas).

## ⚙️ Instalación y Ejecución

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd backend-76815-meolans
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu URI de conexión:
    ```env
    MONGO_URL=tu_cadena_de_conexion_a_mongodb
    PORT=8080
    ```

4.  **Iniciar la aplicación:**
    ```bash
    npm start
    ```
    El servidor correrá por defecto en: `http://localhost:8080`.

## 🛣️ Principales Rutas (API & Views)

### Vistas (Navegador)
* `GET /home`: Lista de productos estática.
* `GET /realtimeproducts`: Gestión de productos con actualización en tiempo real.
* `GET /carts/:cid`: Detalle de un carrito específico con sus productos completos.

### API de Productos
* `GET /api/products`: Devuelve los productos con filtros (query), paginación (limit, page) y orden (sort).
* `POST /api/products`: Crea un nuevo producto y emite el evento vía Socket.io.

### API de Carritos
* `DELETE /api/carts/:cid/products/:pid`: Elimina un producto específico del carrito.
* `PUT /api/carts/:cid`: Actualiza el carrito con un arreglo de productos.
* `PUT /api/carts/:cid/products/:pid`: Actualiza solo la cantidad de un producto.
* `DELETE /api/carts/:cid`: Vacía el carrito por completo.

## 📂 Estructura del Proyecto

```text
src/
├── config/      # Configuración de base de datos
├── data/        # Archivos JSON (legacy)
├── managers/    # Lógica de persistencia en archivos
├── models/      # Esquemas de Mongoose (Product, Cart)
├── routes/      # Endpoints de la API y Vistas
├── views/       # Plantillas Handlebars
└── app.js       # Punto de entrada y config. de Sockets
