import { pool as db } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { transporter } from '../config/mailer.js';


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
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        // Guardar en MYSQL
        await db.query(
            'INSERT INTO password_reset_tokens (user_Id, token, expires_at) VALUES (?,?,?)',
            [userId, tokenHash, expiresAt]
        );
        // Crea el link de recuperación.
        const resetUrl = `http://localhost:5173/authV2?token=${tokenReal}`;
        // Simulación del envío.
        await transporter.sendMail ({
            from: '"Pure Cinema Feel" onboarding@resend.dev',
            to: correo_electronico, // Correo electrónico del usuario que recupera
            subject: "🔄 Restablecer Acceso - Pure Cinema Feel",
            html:`
                <div style="background-color: #0b0c10; color: #ffffff; padding: 40px; font-family: 'Montserrat', sans-serif; text-align: center; border-radius: 8px; max-width: 500px; margin: 0 auto; border: 1px solid #1f2833;">
                    <h1 style="color: #00ffff; font-size: 26px; text-shadow: 0 0 10px #00ffff; letter-spacing: 2px;">PURE CINEMA FEEL</h1>
                    <div style="height: 2px; background: linear-gradient(to right, #ff00ff, #00ffff); margin: 20px 0 30px 0;"></div>
                    
                    <p style="color: #c5c6c7; font-size: 16px; line-height: 1.6;">
                        Has solicitado restablecer el acceso a tu cuenta cibernética cinematográfica.
                    </p>
                    <p style="color: #ff00ff; font-weight: bold; margin-top: 15px;">Este enlace vencerá estrictamente en 10 minutos.</p>
                    
                    <div style="margin: 35px 0;">
                        <a href="${resetUrl}" style="background-color: #0b0c10; border: 2px solid #00ffff; color: #00ffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 4px; box-shadow: 0 0 15px #00ffff; display: inline-block;">
                            RESTABLECER CONTRASEÑA
                        </a>
                    </div>
                    
                    <p style="color: #45f3ff; font-size: 12px; margin-top: 40px; opacity: 0.6;">
                        Si tú no solicitaste este cambio, ignora este mensaje con seguridad.
                    </p>
                </div>

            `
        });

        console.log(`📬 Correo real enviado vía Nodemailer a: ${correo_electronico}`);
        // Repsuesta final para el frontend.
        return res.json({ success: true, message: "Token enviado al correo" });





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

        // Verificar si existe en la base de datos.
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