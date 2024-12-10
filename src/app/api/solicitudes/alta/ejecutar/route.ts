import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";
import { getSingleSolicitud } from "../common";

interface Solicitud {
	descripcion: string;
	turnoDescripcion: string;
	ejecutorNombre: string;
	motivoRechazoDescripcion: string;
}

const createExecutionHTML = (solicitud: Solicitud, id: string) => {
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
        <div class="field">
            <label>Descripción del Forzado:</label>
            <span>${solicitud.descripcion}</span>
        </div>
        <div class="field">
            <label>Turno:</label>
            <span>${solicitud.turnoDescripcion}</span>
        </div>
        <div class="field">
            <label>Encargado de ejecución:</label>
            <span>${solicitud.ejecutorNombre}</span>
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
			const [solicitud] = await getSingleSolicitud(id);

			const mailOptions: MailOptions = {
				from: "test@prot.one",
				to: `${solicitud.solicitanteACorreo}, ${solicitud.aprobadorACorreo}, ${solicitud.ejecutorACorreo}`,
				subject: "[FORZADOS] Solicitud de alta ejecutada correctamente",
				html: createExecutionHTML(solicitud, id),
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
