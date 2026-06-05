import { pool } from '../config/db.js';

export const create = async (userData) => {
        const {nombres, apellidos, correo_electronico, password_hash, rol} = userData;

        const query = `
            INSERT INTO users (nombres, apellidos, correo_electronico, password_hash, rol)
            VALUES (?,?,?,?,?)
        `;

        //Ejecutamos el INSERT pasándole los parámetros en orden
        // pool.query() en un INSERT y nos devuleve un objeto con información del registro creado.
        const [result] = await pool.query(query, [nombres, apellidos, correo_electronico, password_hash, rol]);

        // Retornamos el ID del nuevo usuario creado por si lo necesita el controlador
        return result.insertId;
};