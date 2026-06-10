import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Creamosel transporte usando las variables de entorno estables de Resend
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true, // TRUE para puerto 465 y FALSE para puerto 587
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    //🛡️ Añadimos esto para evitar problemas con certificados locales en desarrollo
    tls: {rejectUnauthorized: false}
});

// VErificación rapida en la consola al arrancar el servidor
transporter.verify().then(()=> {
    console.log("Servidor de correos listo para el despegue! 📧√");
}).catch ((error)=> {
    console.log("Error en la configuración del correo:", error);
});