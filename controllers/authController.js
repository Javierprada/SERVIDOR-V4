import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'  ;




// ==========================================
// 1. CONTROLADOR DE LOGIN (Para Administrador)
// ==========================================
export const loginAdmin = async (req, res) => {
    try {
        const { correo_electronico, password } = req.body;

        // Validamos que vengan información en los campos
        if (!correo_electronico || !password) {
                return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
        }

        // Buscamos el usuario ADMIN en la base de datos
        const usuario = await User.findByEmail(correo_electronico);

        // Validar si el usuario existe
        if (!usuario) {
                return res.status(401).json({ success: false, message: "Credenciales Incorrectas" });
        }

        const contraseñaCorrecta = await bcrypt.compare(password, usuario.password_hash)
        // Validamos contraseña y ROL del ADMIN (Aseguramos que sea el administrador)
        if (!contraseñaCorrecta) {
                return res.status(401).json({ success: false, message: "Credenciales Incorrectas" });
        }

        // Validamos ROL ADMIN
        if (usuario.rol !== 'admin' && usuario.rol !== 'usuario') {
                return res.status(403).json({ success: false, message: "Acceso DENEGADO. Rol no autorizado" });
        }

        

        // Si todo sale con ÉXITO respondemos positivamente al FRONTEND
        return res.status(200).json({ 
            success: true,
            message: "Autenticación Éxitosa √",
            administrador_conectado: {
                id: usuario.id,
                nombre: usuario.nombres,
                apellidos: usuario.apellidos,
                rol: usuario.rol
            
                }
            
        });


     } catch (error) {
            // Si ocurre cualquier error interno en la consulta SQL, caerá aquí sin tumbar el servidor
            console.log("❌ Error interno en el controlador de login:", error);
            return res.status(500).json({ success: false, message: "Error interno en el servidor" });
    }


   
    
};




