import { pool as db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';



// Solicitar recuperación.
export const forgotPassword = async (req, res) => {
    const{ correo_electronico } = req.body;
    try {
        // Aqui se hace la consulta.
        const [users] = await db.query(
            'SELECT id FROM users WHERE correo_electronico = ?',
            [correo_electronico]
        );

        // Validar si existe.
        if (users.length === 0) {
            return res.status(200).json({ success: false, message: "Si existe una cuenta asociada al correo, recibirás instrucciones para restablecer tu contraseña." });
        }

        // Obtener el ID.
        const userId = users[0].id;
        // Generar token real.
        const tokenReal = crypto.randomBytes(32).toString('hex');
        // Crea el HASH.
        const tokenHash = crypto.createHash('sha256').update(tokenReal).digest('hex');
        // Fecha de expiracion.
        const expiresAt = new Date();
        // Token valido durante 1 hora.
        expiresAt.setHours(expiresAt.getHours() + 1);
        // Guardar en MYSQL
        await db.query(
            'INSERT INTO password_reset_tokens (user_Id, token, expires_at) VALUES (?,?,?)',
            [userId, tokenHash, expiresAt]
        );
        // Crea el link de recuperación.
        const linkDeRecuperacion = `http://purecinemafeel.com/reset-password?token=${tokenReal}`;
        // Simulación del envío.
        console.log(`📧 Enlace: ${linkDeRecuperacion}`);
        // Respuesta final.
        return res.json({ success: true, message: "Token enviado al correo" })





    }catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Error interno" });
    }

};


// Función 2 validar y cambiar contraseña
export const resetPassword = async (req, res) => {
    const { token, nuevaContraseña } = req.body;

    if (!token || !nuevaContraseña) {
        return res.status(400).json({success: false, message: "Falta el token o la nueva contraseña en la petición 🚷"});
    }

    

    try {
        console.log(req.body);
        console.log(token);
        // Calculamos el hash de forma ultrasegura.
        const receivedHash = crypto.createHash('sha256').update(token).digest('hex');
        // Buscar el token.
        const [tokenRow] = await db.query(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()',
            [receivedHash]
        );

        // Verificar si existe.
        if (tokenRow.length === 0) {
            return res.status(400).json({ success: false, message: "Token invalido o expirado." });
        }

        // Obtener ID
        const userId = tokenRow[0].user_id;
        const tokenId = tokenRow[0].id;

        const hashedPassword = await bcrypt.hash(
            nuevaContraseña,
            10
        );
        // Cambiar contraseña
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
        // Invalidar todos los tokens activos del usuario.
        await db.query('UPDATE password_reset_tokens SET used = 1 WHERE user_Id = ?', [userId]);

        return res.json({ success: true, message: "Contraseña actualizada con éxito." });


    }catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error al cambiar la contraseña" });
    }
};