import Movie from '../models/movieModel.js';




// Controlador para registrar una nueva pelicula en la plataforma.
export const uploadMovie = async (req, res) => {
    // Destructurar los campos que vienen desde el form de REACT
    const {title, description, genre, director, actors, release_date, trailer_url, poster_url, video_url, duration_minutes} = req.body;
    
    

    // Validación rápida de campos obligatorios para proteger la integridad de la DB.
    if (!title || !genre || !video_url) {
        return res.status(400).json({ 
            success: false,
            message: "Faltan campos críticos: Título, Género y URL del Video son obligatorios 🎥"
         });
    }

    try {
        // 2. El controlador le pide al Modelo ejecutar la acción en MySQL

        // Procedemos a ejecutar la inserción 
        const result = await Movie.create(req.body);
        console.log("🎬 Nueva película inyectada con ID:", result.insertId);
        
        return res.status(201).json({ success: true, message: "¡Película cargada exitosamente a la base de datos! 🍿", movieId: result.insertId });

    }catch (error) {
        console.error("❌ Error en el servidor al cargar la película:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno en el nexo del servidor al procesar la inyección de media."
        });
    }




};


export const getMoviesForDashboard = async (req, res) => {
    console.log("📡 Petición entrante: Intentando sincronizar catálogo con MySQL...");
    // Llamamos el metodo del MODELO
    try {
        const movies = await Movie.getAll();
        console.log(`✅ Éxito: ${movies.length} flujos de películas listos para el Frontend.`);

        // 2. Respondemos inmediatamente al cliente para cerrar la conexión
        return res.status(200).json({
            success: true,
            count: movies.length,
            movies: movies

        });
    }catch (error) {
        console.error("❌ Error catastrófico en el nexo del controlador:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al obtener el catálogo de películas."
        });

    }

};