import { pool } from '../config/db.js';

const User = {
    findByEmail: async (correo_electronico, callback) => {
        // Buscamos el usuario por email.
        const query = "SELECT * FROM users WHERE correo_electronico = ? LIMIT 1"

        // Ejecutamos la consulta usando await de forma moderna
        // mysql2/promise devuelve un arreglo donde la primera posición [rows] son las filas
        const [rows] = await pool.query(query, [correo_electronico]); // Sin await, el código seguiría ejecutándose sin esperar el resultado de la consulta.

        // Retornamos directamente el primer usuario o null si no hay ninguno
        return rows[0] || null;
    },



    





};

export default User;
