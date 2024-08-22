const express = require('express');
const connectDB = require('./config/db'); // Asegúrate de que esta función se conecta a MongoDB correctamente
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler'); // Manejo de errores personalizado

dotenv.config();
connectDB();

const app = express();

// Configuración de CORS (puedes ajustar los orígenes permitidos si es necesario)
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuario')); // Asegúrate de que ./routes/usuario.js exporta las rutas
app.use('/api/trabajadores', require('./routes/trabajador')); // Asegúrate de que ./routes/trabajador.js exporta las rutas
app.use('/api/mediciones', require('./routes/medicion')); // Asegúrate de que ./routes/medicion.js exporta las rutas

// Verifica el secreto JWT (para desarrollo, asegúrate de que esto no se exponga en producción)
console.log(process.env.JWT_SECRET);

// Middleware para manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Inicia el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
