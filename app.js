// Importa los módulos necesarios
import express from 'express'; // Framework web para Node.js
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import forgPassword  from './routes/forgPassword.js';
import movieRoutes from './routes/movieRoutes.js';


// Inicializa la configuración de dotenv
dotenv.config();

// Inicializa la aplicación Express
const app = express();

// Middleware para habilitar CORS (Evita bloqueos de comunicación con React)
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
// Express lee los datos enviados en las solicitudes POST (registro, login)
app.use(express.json());

// Prueba la conexión a la base de datos al iniciar la aplicación
// Esto asegura que la DB esté accesible antes de que el servidor comience a escuchar solicitudes
testDbConnection();

/*=================================================== RUTAS = EDNPOINTS ==================================================== */
// Conectamos las rutas de autenticación importadas.
    app.use('/api/auth', authRoutes);
    app.use('/api/auth', authRoutes);


// * ========================================= RUTAS RECUPERACIÓN DE CONTRASEÑA ===================================== */
    app.use('/api/auth', forgPassword);
    
// * =========================================    RUTAS DE RECEPCIÓN DE MEDIA   ====================================== */

    app.use('/api/injection', movieRoutes);












// Ruta de prueba simple para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('¡Servicio de autenticación satisfactorio!');
});

// Se define el puerto dond el servidor escuchará
const PORT = process.env.PORT || 8080;

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor de autenticación corriendo en el puerto ${8080}`);
    console.log(`Accede a http://localhost:${8080}`);
});

