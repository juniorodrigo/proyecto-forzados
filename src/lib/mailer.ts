import nodemailer, { Transporter } from "nodemailer";

export interface MailOptions {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

class Mailer {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	async sendMail(options: MailOptions): Promise<void> {
		try {
			await this.transporter.sendMail(options);
			console.log(`Correo enviado a ${options.to}`);
		} catch (error) {
			console.error("Error al enviar correo:", error);
			throw new Error("No se pudo enviar el correo");
		}
	}
}

export const mailer = new Mailer();
