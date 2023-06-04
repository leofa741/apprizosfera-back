const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');




const app = express();
const port = process.env.PORT || 3000;
// CORS
app.use( cors() );
// Directorio publico

app.use(express.static('public'));


// Lectura y parseo del body

app.use(express.json());




// Database
dbConnection();

// Routes
app.use('/api/usuarios', require('./routes/usuarios')); // Ruta para usuarios
app.use('/api/login', require('./routes/auth')); // Ruta para login
app.use('/api/categorias', require('./routes/categorias')); // Ruta para categorias
app.use('/api/productos', require('./routes/productos')); // Ruta para productos
app.use('/api/buscar', require('./routes/busquedas')); // Ruta para busquedas
app.use('/api/uploads', require('./routes/uploads')); // Ruta para busquedas




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}
);
