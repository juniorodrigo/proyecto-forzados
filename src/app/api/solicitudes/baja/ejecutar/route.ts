import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";

interface Solicitud {
	SOLICITUD_ID: number;
	OBSERVACIONES_B: string;
}

const createApprovalHTML = (solicitud: Solicitud) => {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La solicitud de baja ha sido ejecutada</title>
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
        <h1>Solicitud de Baja Ejecutada</h1>
        <div class="field">
            <label>ID de Solicitud:</label>
            <span>${solicitud.SOLICITUD_ID}</span>
        </div>
        <div class="field">
            <label>Observaciones:</label>
            <span>${solicitud.OBSERVACIONES_B ?? ""}</span>
        </div>
    </div>
</body>
</html>
    `;
};

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, usuario } = await request.json();
		const result = await pool
			.request()
			.input("id", id)
			.input("usuario", usuario)
			.query("UPDATE TRS_Solicitud_forzado SET ESTADOSOLICITUD = 'FINALIZADO', USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE SOLICITUD_ID = @id");

		if (result.rowsAffected[0] > 0) {
			const motivoResult = await pool.request().input("id", id).query(`
				SELECT SF.SOLICITUD_ID, SF.OBSERVACIONES_B,
					UA.CORREO AS APROBADOR_CORREO,
					UE.CORREO AS EJECUTOR_CORREO,
					US.CORREO AS SOLICITANTE_CORREO
				FROM TRS_SOLICITUD_FORZADO SF
				LEFT JOIN MOTIVO_RECHAZO MR ON SF.MOTIVORECHAZO_B_ID = MR.MOTIVORECHAZO_ID
				LEFT JOIN MAE_USUARIO UA ON SF.APROBADOR_B_ID = UA.USUARIO_ID
				LEFT JOIN MAE_USUARIO UE ON SF.EJECUTOR_B_ID = UE.USUARIO_ID
				LEFT JOIN MAE_USUARIO US ON SF.SOLICITANTE_B_ID = US.USUARIO_ID
                WHERE SF.SOLICITUD_ID = @id
            `);

			if (motivoResult.recordset.length > 0) {
				const solicitud = motivoResult.recordset[0];
				const recipients = [solicitud.SOLICITANTE_CORREO, solicitud.APROBADOR_CORREO, solicitud.EJECUTOR_CORREO];

				for (const recipient of recipients) {
					const mailOptions: MailOptions = {
						from: "test@prot.one",
						to: recipient,
						subject: "[FORZADOS] Solicitud de baja ejecutada correctamente",
						html: createApprovalHTML(solicitud),
					};

					mailer
						.sendMail(mailOptions)
						.catch((error) => console.error("Error sending email to", recipient, ":", error))
						.then(() => {
							console.log("Email sent successfully to ", recipient);
						});
				}
			}

			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error inserting data" }, { status: 500 });
	}
}
