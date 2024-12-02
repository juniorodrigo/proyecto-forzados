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
			tls: {
				rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
			},
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	async sendMail(options: MailOptions): Promise<boolean> {
		if (!options.from) throw new Error("El campo 'from' es obligatorio");
		if (!options.to) throw new Error("El campo 'to' es obligatorio");
		if (!options.subject) throw new Error("El campo 'subject' es obligatorio");

		try {
			await this.transporter.sendMail(options);
			console.log(`Correo enviado a ${options.to}`);
			return true;
		} catch (error) {
			console.error("Error al enviar correo:", error);
			return false;
		}
	}

	async sendTestMail(): Promise<boolean> {
		const testMailOptions: MailOptions = {
			from: process.env.SMTP_USER || "default@example.com",
			to: "jvniorrodrigo@gmail.com",
			subject: "hola mundo",
			text: "hola mundo",
		};

		await this.sendMail(testMailOptions);
		console.log("Correo de prueba enviado");
		return true;
	}
}

export const mailer = new Mailer();
