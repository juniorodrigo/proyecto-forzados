import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";
import { getSingleSolicitud } from "../../alta/common";

interface Solicitud {
	descripcion: string;
	turnoDescripcion: string;
	aprobadorNombre: string;
	motivoRechazoDescripcion: string;
}

const createRejectionHTML = (solicitud: Solicitud) => {
	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La solicitud de forzado ha sido rechazada</title>
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
            margin-bottom: 20px;
        }
        .field {
            background-color: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .field label {
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            display: block;
        }
        .field span {
            display: block;
            color: #555;
            margin-top: 5px;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Solicitud Rechazada</h1>
        <div class="field">
            <label>Descripción del Forzado:</label>
            <span>${solicitud.descripcion}</span>
        </div>
        <div class="field">
            <label>Turno:</label>
            <span>${solicitud.turnoDescripcion}</span>
        </div>
        <div class="field">
            <label>Encargado de rechazo:</label>
            <span>${solicitud.aprobadorNombre}</span>
        </div>
        <div class="field">
            <label>Motivo de Rechazo:</label>
            <span>${solicitud.motivoRechazoDescripcion}</span>
        </div>
    </div>
</body>
</html>
	`;
};

export async function POST(request: Request) {
	const pool = await poolPromise;

	const transaction = await pool.transaction();
	await transaction.begin();

	try {
		const { id, observacionEjecucion, usuario } = await request.json();

		// Actualización combinada
		const result = await pool.request().input("id", id).input("observacionEjecucion", observacionEjecucion).input("usuario", usuario).query(`
                UPDATE TRS_Solicitud_forzado 
                SET OBSERVADO_B = 1,
                    OBSERVACION_RECHAZO_B = @observacionEjecucion,
                    FECHA_MODIFICACION = GETDATE(),
                    USUARIO_MODIFICACION = @usuario,
					ESTADOSOLICITUD = 'PENDIENTE-ALTA'
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

		const [solicitud] = await getSingleSolicitud(id);

		const mailOptionsAprobador: MailOptions = {
			from: "test@prot.one",
			to: solicitud.aprobadorACorreo,
			subject: "[FORZADOS] Solicitud de retiro observada durante ejecución",
			html: createRejectionHTML(solicitud),
		};

		const mailOptionsEjecutor: MailOptions = {
			from: "test@prot.one",
			to: solicitud.ejecutorACorreo,
			subject: "[FORZADOS] Solicitud de retiro observada durante ejecución",
			html: createRejectionHTML(solicitud),
		};

		const mailOptionsSolicitante: MailOptions = {
			from: "test@prot.one",
			to: solicitud.solicitanteACorreo,
			subject: "[FORZADOS] Solicitud de retiro observada durante ejecución",
			html: createRejectionHTML(solicitud),
		};

		// Enviar correos de forma no bloqueante
		await Promise.all([
			mailer.sendMail(mailOptionsAprobador).catch((error) => console.error("Error sending email to aprobador:", error)),
			mailer.sendMail(mailOptionsEjecutor).catch((error) => console.error("Error sending email to ejecutor:", error)),
			mailer.sendMail(mailOptionsSolicitante).catch((error) => console.error("Error sending email to solicitante:", error)),
		]);

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
