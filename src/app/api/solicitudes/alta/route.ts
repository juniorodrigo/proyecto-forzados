import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";
import { getSingleSolicitud } from "@/app/api/solicitudes/alta/common";

export async function GET() {
	try {
		const solicitudes = await getAllSolicitudes();
		return NextResponse.json({ success: true, message: "Records fetched successfully", data: solicitudes });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Failed to fetch records" }, { status: 500 });
	}
}

//TODO: ACTUALIZAR MOTIVO RECHAZO ID
const getAllSolicitudes = async () => {
	const pool = await poolPromise;
	const result = await pool.query(`
SELECT
		SF.SOLICITUD_ID,
    SF.DESCRIPCIONFORZADO,
    SF.ESTADOSOLICITUD,
    SF.FECHAEJECUCION_A, -- Actualizado
    SF.FECHACIERRE,
    SF.USUARIO_CREACION,
    SF.FECHA_CREACION,
    SF.USUARIO_MODIFICACION,
    SF.FECHA_MODIFICACION,

    -- Datos de SUB_AREA
    SA.CODIGO AS SUBAREA_CODIGO,
    SA.DESCRIPCION AS SUBAREA_DESCRIPCION,

    -- Datos de DISCIPLINA  
    D.DESCRIPCION AS DISCIPLINA_DESCRIPCION,

    -- Datos de TURNO
    T.DESCRIPCION AS TURNO_DESCRIPCION,

    -- Datos de MOTIVO_RECHAZO
    MR.DESCRIPCION AS MOTIVORECHAZO_DESCRIPCION,

    -- Datos de TIPO_FORZADO
    TF.DESCRIPCION AS TIPOFORZADO_DESCRIPCION,

    -- Datos de TAG_CENTRO
    TC.CODIGO AS TAGCENTRO_CODIGO,
    TC.DESCRIPCION AS TAGCENTRO_DESCRIPCION,

    -- Datos de RESPONSABLE
    R.NOMBRE AS RESPONSABLE_NOMBRE,

    -- Datos de RIESGO_A
    RA.DESCRIPCION AS RIESGOA_DESCRIPCION,

    -- USUARIO:
    UX.NOMBRE AS NOMBRE_SOLICITANTE,
    UX.APEPATERNO AS AP_SOLICITANTE,
    UX.APEMATERNO AS AM_SOLICITANTE

FROM
    TRS_SOLICITUD_FORZADO SF
LEFT JOIN
    SUB_AREA SA ON SF.SUBAREA_ID = SA.SUBAREA_ID
LEFT JOIN
    DISCIPLINA D ON SF.DISCIPLINA_ID = D.DISCIPLINA_ID
LEFT JOIN
    TURNO T ON SF.TURNO_ID = T.TURNO_ID
LEFT JOIN
    MOTIVO_RECHAZO MR ON SF.MOTIVORECHAZO_A_ID = MR.MOTIVORECHAZO_ID
LEFT JOIN
    TIPO_FORZADO TF ON SF.TIPOFORZADO_ID = TF.TIPOFORZADO_ID
LEFT JOIN
    TAG_CENTRO TC ON SF.TAGCENTRO_ID = TC.TAGCENTRO_ID
LEFT JOIN
    RESPONSABLE R ON SF.RESPONSABLE_ID = R.RESPONSABLE_ID
LEFT JOIN
    MAE_RIESGO_A RA ON SF.RIESGOA_ID = RA.RIESGOA_ID
    LEFT JOIN MAE_USUARIO UX ON SF.USUARIO_CREACION = CAST(UX.USUARIO_ID AS CHAR)
	`);
	return result.recordset.map((record) => ({
		id: record.SOLICITUD_ID,
		nombre: record.DESCRIPCIONFORZADO,
		area: record.SUBAREA_DESCRIPCION,
		solicitante: record.NOMBRE_SOLICITANTE + " " + record.AP_SOLICITANTE + " " + record.AM_SOLICITANTE,
		estado: record.ESTADOSOLICITUD,
		fecha: record.FECHA_CREACION,
		descripcion: record.DESCRIPCIONFORZADO,
		estadoSolicitud: record.ESTADOSOLICITUD,
		fechaRealizacion: record.FECHAEJECUCION_A, // Actualizado
		fechaCierre: record.FECHACIERRE,
		usuarioCreacion: record.USUARIO_CREACION,
		fechaCreacion: record.FECHA_CREACION,
		usuarioModificacion: record.USUARIO_MODIFICACION,
		fechaModificacion: record.FECHA_MODIFICACION,
		subareaCodigo: record.SUBAREA_CODIGO,
		subareaDescripcion: record.SUBAREA_DESCRIPCION,
		disciplinaDescripcion: record.DISCIPLINA_DESCRIPCION,
		turnoDescripcion: record.TURNO_DESCRIPCION,
		motivoRechazoDescripcion: record.MOTIVORECHAZO_DESCRIPCION,
		tipoForzadoDescripcion: record.TIPOFORZADO_DESCRIPCION,
		tagCentroCodigo: record.TAGCENTRO_CODIGO,
		tagCentroDescripcion: record.TAGCENTRO_DESCRIPCION,
		responsableNombre: record.RESPONSABLE_NOMBRE,
		riesgoDescripcion: record.RIESGOA_DESCRIPCION,
	}));
};

export async function PUT(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateUpdateQuery(data);
		console.log(query);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.rowsAffected && result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully", data });
		} else {
			return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

export async function POST(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		const query = generateInsertQuery(data);
		console.log(query);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.recordset && result.recordset.length > 0) {
			const insertedId = result.recordset[0].SOLICITUD_ID;

			const newSolicitud = await getSingleSolicitud(insertedId);
			const newSolicitudHtml = createSolicitudHTML(newSolicitud[0]);

			const mailOptions: MailOptions = {
				from: "test@prot.one",
				to: "jvniorrodrigo@gmail.com",
				subject: "[ALTA-FORZADO] Nueva Solicitud Creada",
				html: newSolicitudHtml,
			};

			const mailResult: boolean = await mailer.sendMail(mailOptions);

			if (!mailResult) {
				return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
			}

			return NextResponse.json({
				success: true,
				message: "Record inserted successfully",
				data,
			});
		} else {
			return NextResponse.json({ success: false, message: "Failed to insert record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

type InsertQueryParameters = {
	tagPrefijo: string;
	tagCentro: string;
	tagSubfijo: string;
	descripcion: string;
	disciplina: string;
	turno: string;
	interlockSeguridad: string;
	responsable: string;
	riesgo: string;
	probabilidad: string;
	solicitante: string;
	aprobador: string;
	ejecutor: string;
	autorizacion: string;
	tipoForzado: string;
	usuario: string; // ES EL USUARIO QUE ESTÁ REALIZANDO LA SOLICITUD
};
const generateInsertQuery = (parameters: InsertQueryParameters) => {
	return `INSERT INTO TRS_SOLICITUD_FORZADO (
    SUBAREA_ID,
    DISCIPLINA_ID,
    TURNO_ID,
    MOTIVORECHAZO_A_ID,
    TIPOFORZADO_ID,
    TAGCENTRO_ID,
    TAGSUFIJO,
    RESPONSABLE_ID,
    RIESGOA_ID,
    TIPOSOLICITUD,
    INTERLOCK,
    DESCRIPCIONFORZADO,
    FECHAEJECUCION_A, -- Actualizado
    FECHACIERRE,

    USUARIO_CREACION,
    FECHA_CREACION,
    USUARIO_MODIFICACION,
    FECHA_MODIFICACION,

    ESTADOSOLICITUD,
	SOLICITANTE_A_ID,
	APROBADOR_A_ID,
	EJECUTOR_A_ID,
	PROBABILIDAD_RIESGO
)
OUTPUT INSERTED.SOLICITUD_ID 
VALUES (
    ${parameters.tagPrefijo}, -- SUBAREA_ID
    ${parameters.disciplina}, -- DISCIPLINA_ID
    ${parameters.turno}, -- TURNO_ID
    NULL, -- MOTIVORECHAZO_A_ID
    ${parameters.tipoForzado}, -- TIPOFORZADO_ID
    ${parameters.tagCentro}, -- TAGCENTRO_ID
    '${parameters.tagSubfijo}', -- TAGSUFIJO
    ${parameters.responsable}, -- RESPONSABLE_ID
    ${parameters.riesgo}, -- RIESGOA_ID
    2, -- TIPOSOLICITUD
    ${parameters.interlockSeguridad.toLowerCase() === "sí" ? 1 : 0}, -- INTERLOCK
    '${parameters.descripcion}', -- DESCRIPCIONFORZADO
    NULL, -- FECHAEJECUCION_A, Actualizado
    NULL, -- FECHACIERRE

    '${parameters.usuario}', -- USUARIO_CREACION
    GETDATE(), -- FECHA_CREACION
    '${parameters.usuario}', -- USUARIO_MODIFICACION
    GETDATE(), -- FECHA_MODIFICACION
    
    'PENDIENTE-ALTA',
	${parameters.solicitante},
	${parameters.aprobador},
	${parameters.ejecutor},
	${parameters.probabilidad}
);`;
};

type UpdateQueryParameters = {
	[key: string]: string | number | boolean;
};
const generateUpdateQuery = (parameters: UpdateQueryParameters) => {
	console.log(parameters);

	return `UPDATE TRS_SOLICITUD_FORZADO SET
		SUBAREA_ID = ${parameters.tagPrefijo},
		DISCIPLINA_ID = ${parameters.disciplina},
		TURNO_ID = ${parameters.turno},
		TIPOFORZADO_ID = ${parameters.tipoForzado},
		TAGCENTRO_ID = ${parameters.tagCentro},
		TAGSUFIJO = '${parameters.tagSubfijo}',
		RESPONSABLE_ID = ${parameters.responsable},
		RIESGOA_ID = ${parameters.riesgo},
        INTERLOCK = ${typeof parameters.interlockSeguridad === "string" && parameters.interlockSeguridad.toLowerCase() === "sí" ? 1 : 0},
		DESCRIPCIONFORZADO = '${parameters.descripcion}',

		USUARIO_MODIFICACION = '${parameters.usuario}',
		FECHA_MODIFICACION = GETDATE(),

		ESTADOSOLICITUD = 'pendiente'
	WHERE SOLICITUD_ID = ${parameters.id};`;
};

type ResumenSolicitud = {
	descripcion: string;
	estadoSolicitud: string;
	fechaRealizacion: string | null;
	fechaCierre: string | null;
	aprobadorNombre: string;
	ejecutorNombre: string;
	solicitanteNombre: string;
	subareaDescripcion: string;
	disciplinaDescripcion: string;
	turnoDescripcion: string;
	motivoRechazoDescripcion: string;
	tipoForzadoDescripcion: string;
	tagCentroDescripcion: string;
	responsableNombre: string;
	riesgoDescripcion: string;
};
const createSolicitudHTML = (solicitud: ResumenSolicitud) => {
	const createField = (label: string, value: string | null | undefined) => {
		if (!value || value === "null") {
			return ""; // Si el valor no es válido, no se genera el campo
		}
		return `
            <div class="field">
                <label>${label}:</label>
                <span>${value}</span>
            </div>
        `;
	};

	return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumen de Solicitud</title>
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
        .field-group {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
        }
        .field {
            background-color: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
        .button {
            display: block;
            width: 150px;
            margin: 30px auto 0;
            padding: 10px;
            text-align: center;
            background-color: #007BFF;
			text-color: white;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        @media (max-width: 600px) {
            .field-group {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Resumen de Solicitud</h1>
        <div class="field-group">
            ${createField("Descripción", solicitud.descripcion)}
            ${createField("Estado de Solicitud", solicitud.estadoSolicitud)}
            ${createField("Fecha de Realización", solicitud.fechaRealizacion)}
            ${createField("Fecha de Cierre", solicitud.fechaCierre)}
            ${createField("Solicitante", solicitud.solicitanteNombre)}
            ${createField("Ejecutor", solicitud.ejecutorNombre)}
            ${createField("Aprobador", solicitud.aprobadorNombre)}
            ${createField("Subárea", solicitud.subareaDescripcion)}
            ${createField("Disciplina", solicitud.disciplinaDescripcion)}
            ${createField("Turno", solicitud.turnoDescripcion)}
            ${createField("Motivo de Rechazo", solicitud.motivoRechazoDescripcion)}
            ${createField("Tipo de Forzado", solicitud.tipoForzadoDescripcion)}
            ${createField("Tag Centro", solicitud.tagCentroDescripcion)}
            ${createField("Responsable", solicitud.responsableNombre)}
            ${createField("Riesgo", solicitud.riesgoDescripcion)}
        </div>
        <a href="https://google.com" class="button">Aprobar</a>
    </div>
</body>
</html>
    `;
};
