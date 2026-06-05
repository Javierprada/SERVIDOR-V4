import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import * as registerModel from '../models/registerModel.js';

// ==========================================
// 2. CONTROLADOR DE REGISTRO (Nueva función independiente)
// ==========================================
export const registrarUsuario = async (req, res) => {
        try {
            const { nombres, apellidos, correo_electronico, password, rol } = req.body;

            // Validamos los campos obligatorios para el registro
            if (!nombres || !correo_electronico || !password) {
                return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
            }

            // Validamos si el correo ya esta registrado antes de crearlo nuevamente.
            const usuarioExistente = await User.findByEmail(correo_electronico)
            if (usuarioExistente) {
                return res.status(400).json({ success: false, message: "El correo electrónico ya esta registrado"});
            }


            // Generar encriptado (SALT & HASH)
            const salt = await bcrypt.genSalt(10);
            const passwordHasheada = await bcrypt.hash(password, salt);

            // Enviar los datos al modelo
            await registerModel.create({
                nombres: nombres || null, // por si no envian los nombres
                apellidos: apellidos || null,
                correo_electronico: correo_electronico, // Por si no envian los apellidos
                password_hash: passwordHasheada, // Contraseña encriptada
                rol: rol || 'usuario'  // Por defecto sera rol USUARIO.
            });

            // Respuesta de ÉXITO
            return res.status(201).json({
                success: true,
                message: "Usuario registrado con ÉXITO y contraseña protegida 🔒"
            });

        }catch (error) {
                console.error("❌ Error interno en el controlador de registro:", error);
                return res.status(500).json({ 
                        success: false,
                        message: "Error interno en el servidor al registrar"
                 });
            
            }


};