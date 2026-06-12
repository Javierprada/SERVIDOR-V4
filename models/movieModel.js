import { pool } from '../config/db.js'; // Asegúrate de importar tu conexión a MySQL

const Movie = {
    // El modelo se encarga exclusivamente de la operación en la Base de Datos
    create: async (movieData) => {
        const { 
            title, description, genre, director, actors, 
            release_date, trailer_url, poster_url, video_url, duration_minutes 
        } = movieData;

        const query = `
            INSERT INTO movies 
            (title, description, genre, director, actors, release_date, trailer_url, poster_url, video_url, duration_minutes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            title, 
            description || null, 
            genre, 
            director || null, 
            actors || null, 
            release_date || null, 
            trailer_url || null, 
            poster_url || null, 
            video_url, 
            duration_minutes || null
        ];

        // Ejecuta la query y retorna el resultado (donde viene el insertId)
        const [result] = await pool.query(query, values);
        return result;
    },



    getAll: async () => {
            const query = 'SELECT id, title, description, genre, director, actors, release_date, trailer_url, poster_url, video_url FROM movies';

            const [rows] = await pool.query(query);
            return rows;
    },







};




export default Movie;