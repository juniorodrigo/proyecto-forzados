import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";
import bcrypt from "bcrypt";

interface SolicitudRechazo {
	SOLICITUD_ID: number;
	DESCRIPCION: string;
}

const createRejectionHTML = (solicitud: SolicitudRechazo) => {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La solicitud de baja ha sido rechazada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #444;
        }
        .field {
            background-color: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .field label {
            font-weight: bold;
            color: #333;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Solicitud de Baja Rechazada</h1>
        <div class="field">
            <label>ID de Solicitud:</label>
            <span>${solicitud.SOLICITUD_ID}</span>
        </div>
        <div class="field">
            <label>Motivo de Rechazo:</label>
            <span>${solicitud.DESCRIPCION}</span>
        </div>
    </div>
</body>
</html>
    `;
};

export async function POST(request: Request) {
	const pool = await poolPromise;
	const transaction = await pool.transaction();

	try {
		const { id, motivoRechazo, usuario, token } = await request.json();

		if (token) {
			const register = await pool.request().input("id", id).query("SELECT ACTION_TOKEN FROM TRS_SOLICITUD_FORZADO WHERE SOLICITUD_ID = @id");

			if (!register.recordset.length || !register.recordset[0].ACTION_TOKEN) {
				return NextResponse.json(
					{
						success: false,
						message: "Token ha expirado",
					},
					{ status: 400 }
				);
			}

			const isTokenValid = await bcrypt.compare(token, register.recordset[0].ACTION_TOKEN);
			if (!isTokenValid) {
				return NextResponse.json(
					{
						success: false,
						message: "Token inválido",
					},
					{ status: 400 }
				);
			}
		}

		const result = await pool.request().input("id", id).input("motivoRechazo", motivoRechazo).input("usuario", usuario).query(`
                UPDATE TRS_Solicitud_forzado 
                SET 
                    ESTADOSOLICITUD = 'RECHAZADO-BAJA', 
                    MOTIVORECHAZO_B_ID = @motivoRechazo, 
                    FECHA_MODIFICACION = GETDATE(), 
                    USUARIO_MODIFICACION = @usuario,
                    ACTION_TOKEN = ''
                WHERE SOLICITUD_ID = @id
            `);

		if (result.rowsAffected[0] === 0) {
			await transaction.rollback();
			return NextResponse.json(
				{
					success: false,
					message: "No se encontró la solicitud para actualizar",
				},
				{ status: 404 }
			);
		}

		const motivoResult = await pool.request().input("id", id).query(`
				SELECT SF.SOLICITUD_ID, MR.DESCRIPCION,
					UA.CORREO AS APROBADOR_CORREO,
					UE.CORREO AS EJECUTOR_CORREO,
					US.CORREO AS SOLICITANTE_CORREO
				FROM TRS_SOLICITUD_FORZADO SF
				INNER JOIN MOTIVO_RECHAZO MR ON SF.MOTIVORECHAZO_B_ID = MR.MOTIVORECHAZO_ID
				INNER JOIN MAE_USUARIO UA ON SF.APROBADOR_B_ID = UA.USUARIO_ID
				INNER JOIN MAE_USUARIO UE ON SF.EJECUTOR_B_ID = UE.USUARIO_ID
				INNER JOIN MAE_USUARIO US ON SF.SOLICITANTE_B_ID = US.USUARIO_ID
                WHERE SF.SOLICITUD_ID = @id
            `);

		if (motivoResult.recordset.length > 0) {
			const solicitud = motivoResult.recordset[0];
			const mailOptions: MailOptions = {
				from: "test@prot.one",
				to: `${solicitud.SOLICITANTE_CORREO}, ${solicitud.APROBADOR_CORREO}, ${solicitud.EJECUTOR_CORREO}`,
				subject: "[FORZADOS] Solicitud de baja rechazada",
				html: createRejectionHTML(solicitud),
			};

			// Envío de correo no bloqueante
			mailer.sendMail(mailOptions).catch((error) => console.error("Error sending email:", error));
		}

		await transaction.commit();
		return NextResponse.json({
			success: true,
			message: "Solicitud rechazada exitosamente",
		});
	} catch (error) {
		await transaction.rollback();
		console.error("Error processing POST:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error interno del servidor",
			},
			{ status: 500 }
		);
	}
}
