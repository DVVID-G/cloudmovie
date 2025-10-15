"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MailerService: selects an SMTP transport (Mailtrap or generic) and sends emails.
 */
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
class MailerService {
    transporter;
    constructor() {
        // Mailtrap SMTP preferred
        const mtUser = process.env.MAILTRAP_USER;
        const mtPass = process.env.MAILTRAP_PASS;
        const mtHost = process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io';
        const mtPort = Number(process.env.MAILTRAP_PORT || 2525); // Mailtrap recomienda 2525
        const mtSecureEnv = String(process.env.MAILTRAP_SECURE ?? '').toLowerCase();
        const mtSecure = mtSecureEnv === 'true' ? true : mtSecureEnv === 'false' ? false : mtPort === 465;
        const mtTlsReject = String(process.env.MAILTRAP_TLS_REJECT_UNAUTHORIZED ?? 'true').toLowerCase() !== 'false';
        if (mtUser && mtPass) {
            this.transporter = nodemailer.createTransport({
                host: mtHost,
                port: mtPort,
                secure: mtSecure,
                auth: { user: mtUser, pass: mtPass },
                tls: { rejectUnauthorized: mtTlsReject },
            });
            return;
        }
        // Fallback generic SMTP
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT || 587);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const secureEnv = String(process.env.SMTP_SECURE ?? '').toLowerCase();
        const secure = secureEnv === 'true' ? true : secureEnv === 'false' ? false : port === 465;
        const tlsReject = String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED ?? 'true').toLowerCase() !== 'false';
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
                tls: { rejectUnauthorized: tlsReject },
            });
            return;
        }
        // No SMTP configured -> use JSON transport to avoid network calls
        console.warn('[MailerService] No SMTP config found. Using jsonTransport (emails are not actually sent).');
        this.transporter = nodemailer.createTransport({ jsonTransport: true });
    }
    /**
     * Send password reset email containing a link to reset the password.
     * @param {string} to - Recipient email
     * @param {string} resetUrl - URL with reset token
     */
    async sendPasswordResetEmail(to, resetUrl) {
        const from = process.env.FROM_EMAIL || 'no-reply@example.com';
        const subject = 'Recuperación de contraseña';
        const text = `Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:\n${resetUrl}\n\nSi no solicitaste este cambio, puedes ignorar este correo.`;
        const html = `
			<p>Hola,</p>
			<p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
			<p><a href="${resetUrl}">Restablecer contraseña</a></p>
			<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
		`;
        await this.transporter.sendMail({ from, to, subject, text, html });
    }
}
module.exports = new MailerService();
//# sourceMappingURL=mailerService.js.map