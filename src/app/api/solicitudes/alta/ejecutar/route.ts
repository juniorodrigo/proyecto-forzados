import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";

const createExecutionHTML = (id: number) => {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Alta Ejecutada</title>
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
        <h1>Solicitud de Alta Ejecutada</h1>
        <div class="field">
            <label>ID de Solicitud:</label>
            <span>${id}</span>
        </div>
    </div>
</body>
</html>
    `;
};

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;

		const { id, usuario, fechaEjecucion } = await request.json();

		// Convertir fechaEjecucion a un objeto Date
		const fechaEjecucionDate = new Date(fechaEjecucion);

		if (isNaN(fechaEjecucionDate.getTime())) {
			return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
		}

		const result = await pool.request().input("id", id).input("usuario", usuario).input("fechaEjecucion", fechaEjecucionDate).query(`
				UPDATE TRS_Solicitud_forzado 
				SET 
					ESTADOSOLICITUD = 'EJECUTADO-ALTA',
					FECHAEJECUCION_A = @fechaEjecucion,
					FECHA_MODIFICACION = GETDATE(),
					USUARIO_MODIFICACION = @usuario
				WHERE SOLICITUD_ID = @id
			`);

		if (result.rowsAffected[0] > 0) {
			const emailQuery = `
				SELECT UA.CORREO AS aprobadorCorreo, UE.CORREO AS ejecutorCorreo, US.CORREO AS solicitanteCorreo 
				FROM TRS_SOLICITUD_FORZADO SF 
				LEFT JOIN MAE_USUARIO UA ON SF.APROBADOR_A_ID = UA.USUARIO_ID 
				LEFT JOIN MAE_USUARIO UE ON SF.EJECUTOR_A_ID = UE.USUARIO_ID 
				LEFT JOIN MAE_USUARIO US ON SF.SOLICITANTE_A_ID = US.USUARIO_ID 
				WHERE SF.SOLICITUD_ID = @id
			`;

			const emailResult = await pool.request().input("id", id).query(emailQuery);
			const { aprobadorCorreo, ejecutorCorreo, solicitanteCorreo } = emailResult.recordset[0];

			const mailOptions: MailOptions = {
				from: "test@prot.one",
				to: `${solicitanteCorreo}, ${aprobadorCorreo}, ${ejecutorCorreo}`,
				subject: "[FORZADOS] Solicitud de alta ejecutada correctamente",
				html: createExecutionHTML(id),
			};

			mailer.sendMail(mailOptions).catch((error) => console.error("Error sending email:", error));

			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error inserting data" }, { status: 500 });
	}
}
