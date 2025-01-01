import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateUpdateQuery(data);
		console.log(query);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.rowsAffected && result.rowsAffected[0] > 0) {
			const solicitudResult = await pool.request().input("id", data.id).query(`
				SELECT SF.SOLICITUD_ID,
					SF.OBSERVACIONES_B,
					SF.SOLICITANTE_B_ID,
					UXSB.NOMBRE     AS NOMBRE_SOLICITANTE_B,
					UXSB.APEPATERNO AS AP_SOLICITANTE_B,
					UXSB.APEMATERNO AS AM_SOLICITANTE_B,
					UXSB.CORREO AS SOLICITANTE_B_CORREO,

					SF.APROBADOR_B_ID,
					UXAB.NOMBRE     AS NOMBRE_APROBADOR_B,
					UXAB.APEPATERNO AS AP_APROBADOR_B,
					UXAB.APEMATERNO AS AM_APROBADOR_B,
					UXAB.CORREO AS APROBADOR_B_CORREO,

					SF.EJECUTOR_B_ID,
					UXEB.NOMBRE     AS NOMBRE_EJECUTOR_B,
					UXEB.APEPATERNO AS AP_EJECUTOR_B,
					UXEB.APEMATERNO AS AM_EJECUTOR_B,
					UXEB.CORREO AS EJECUTOR_B_CORREO
				FROM TRS_SOLICITUD_FORZADO SF
				LEFT JOIN MAE_USUARIO UXSB ON SF.SOLICITANTE_B_ID = CAST(UXSB.USUARIO_ID AS CHAR)
				LEFT JOIN MAE_USUARIO UXAB ON SF.APROBADOR_B_ID = CAST(UXAB.USUARIO_ID AS CHAR)
				LEFT JOIN MAE_USUARIO UXEB ON SF.EJECUTOR_B_ID = CAST(UXEB.USUARIO_ID AS CHAR)
				WHERE SOLICITANTE_B_ID IS NOT NULL AND SOLICITUD_ID = @id
			`);

			if (solicitudResult.recordset.length > 0) {
				const solicitud = solicitudResult.recordset[0];
				const mailOptions: MailOptions = {
					from: "test@prot.one",
					to: `${solicitud.SOLICITANTE_B_CORREO}, ${solicitud.APROBADOR_B_CORREO}, ${solicitud.EJECUTOR_B_CORREO}`,
					subject: "[FORZADOS] Solicitud de baja de forzado actualizada",
					html: createApprovalHTML(solicitud),
				};

				mailer.sendMail(mailOptions).catch((error) => console.error("Error sending email:", error));
			}

			return NextResponse.json({ success: true, message: "Record updated successfully", data });
		} else {
			return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

type UpdateQueryParameters = {
	id: string;
	solicitanteRetiro: string;
	aprobadorRetiro: string;
	ejecutorRetiro: string;
	observaciones: string;
	usuario: string;
};

const generateUpdateQuery = (parameters: UpdateQueryParameters) => {
	return `UPDATE TRS_SOLICITUD_FORZADO SET
		SOLICITANTE_B_ID = ${parameters.solicitanteRetiro},
		APROBADOR_B_ID = ${parameters.aprobadorRetiro},
		EJECUTOR_B_ID = ${parameters.ejecutorRetiro},
		OBSERVACIONES_B = '${parameters.observaciones}',
		-- FECHACIERRE = '${1}',

		USUARIO_MODIFICACION = '${parameters.usuario}',
		FECHA_MODIFICACION = GETDATE(),
		ESTADOSOLICITUD = 'PENDIENTE-BAJA'
		
	WHERE SOLICITUD_ID = ${parameters.id};`;
};

interface SolicitudAprobada {
	SOLICITUD_ID: number;
	SOLICITANTE_B_ID: string;
	NOMBRE_SOLICITANTE_B: string;
	AP_SOLICITANTE_B: string;
	AM_SOLICITANTE_B: string;
	APROBADOR_B_ID: string;
	NOMBRE_APROBADOR_B: string;
	AP_APROBADOR_B: string;
	AM_APROBADOR_B: string;
	EJECUTOR_B_ID: string;
	NOMBRE_EJECUTOR_B: string;
	AP_EJECUTOR_B: string;
	AM_EJECUTOR_B: string;
	OBSERVACIONES_B: string;
}

const createApprovalHTML = (solicitud: SolicitudAprobada) => {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Baja Aprobada</title>
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
        <h1>Solicitud de Baja Aprobada</h1>
        <div class="field">
            <label>ID de Solicitud:</label>
            <span>${solicitud.SOLICITUD_ID}</span>
        </div>
        <div class="field">
            <label>Solicitante:</label>
            <span>${solicitud.NOMBRE_SOLICITANTE_B} ${solicitud.AP_SOLICITANTE_B} ${solicitud.AM_SOLICITANTE_B}</span>
        </div>
        <div class="field">
            <label>Aprobador:</label>
            <span>${solicitud.NOMBRE_APROBADOR_B} ${solicitud.AP_APROBADOR_B} ${solicitud.AM_APROBADOR_B}</span>
        </div>
        <div class="field">
            <label>Ejecutor:</label>
            <span>${solicitud.NOMBRE_EJECUTOR_B} ${solicitud.AP_EJECUTOR_B} ${solicitud.AM_EJECUTOR_B}</span>
        </div>
		<div class="field">
            <label>Observaciones de baja:</label>
            <span>${solicitud.OBSERVACIONES_B} </span>
        </div>
    </div>
</body>
</html>
    `;
};
