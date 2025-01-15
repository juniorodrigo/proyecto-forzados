import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import { mailer, MailOptions } from "@/lib/mailer";
import { getSingleSolicitud } from "@/app/api/solicitudes/alta/common";
import bcrypt from "bcrypt";

const generateRandomString = (length: number): string => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

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

    --Datos de proyecto
    SF.PROYECTO_ID AS PROYECTO_ID,
    PROY.DESCRIPCION AS PROYECTO_DESCRIPCION,

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
    SF.SOLICITANTE_A_ID,
    UXSA.NOMBRE AS NOMBRE_SOLICITANTE_A,
    UXSA.APEPATERNO AS AP_SOLICITANTE_A,
    UXSA.APEMATERNO AS AM_SOLICITANTE_A,

    SF.APROBADOR_A_ID,
    UXAA.NOMBRE AS NOMBRE_APROBADOR_A,
    UXAA.APEPATERNO AS AP_APROBADOR_A,
    UXAA.APEMATERNO AS AM_APROBADOR_A,

    SF.EJECUTOR_A_ID,
    UXEA.NOMBRE AS NOMBRE_EJECUTOR_A,
    UXEA.APEPATERNO AS AP_EJECUTOR_A,
    UXEA.APEMATERNO AS AM_EJECUTOR_A,

    -- USUARIO:
    SF.SOLICITANTE_B_ID,
    UXSB.NOMBRE AS NOMBRE_SOLICITANTE_B,
    UXSB.APEPATERNO AS AP_SOLICITANTE_B,
    UXSB.APEMATERNO AS AM_SOLICITANTE_B,

    SF.APROBADOR_B_ID,
    UXAB.NOMBRE AS NOMBRE_APROBADOR_B,
    UXAB.APEPATERNO AS AP_APROBADOR_B,
    UXAB.APEMATERNO AS AM_APROBADOR_B,

    SF.EJECUTOR_B_ID,
    UXEB.NOMBRE AS NOMBRE_EJECUTOR_B,
    UXEB.APEPATERNO AS AP_EJECUTOR_B,
    UXEB.APEMATERNO AS AM_EJECUTOR_B,
    SF.INTERLOCK,

    UXSA.AREA_ID,
    AREAX.DESCRIPCION AS AREA_DESCRIPCION,

    SF.OBSERVADO_A,
    SF.OBSERVACION_RECHAZO_A

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

        LEFT JOIN
    MAE_USUARIO UXSA ON SF.SOLICITANTE_A_ID = CAST(UXSA.USUARIO_ID AS CHAR)
        LEFT JOIN
    MAE_USUARIO UXSB ON SF.SOLICITANTE_B_ID = CAST(UXSB.USUARIO_ID AS CHAR)

        LEFT JOIN
    MAE_AREA AREAX ON UXSA.AREA_ID = AREAX.AREA_ID

        LEFT JOIN
    MAE_USUARIO UXAA ON SF.APROBADOR_A_ID = CAST(UXAA.USUARIO_ID AS CHAR)
        LEFT JOIN
    MAE_USUARIO UXAB ON SF.APROBADOR_B_ID = CAST(UXAB.USUARIO_ID AS CHAR)

        LEFT JOIN
    MAE_USUARIO UXEA ON SF.EJECUTOR_A_ID = CAST(UXEA.USUARIO_ID AS CHAR)
        LEFT JOIN
    MAE_USUARIO UXEB ON SF.EJECUTOR_B_ID = CAST(UXEB.USUARIO_ID AS CHAR)
        LEFT JOIN
    MAE_PROYECTO PROY ON SF.PROYECTO_ID = CAST(PROY.PROYECTO_ID AS CHAR)
	`);
	return result.recordset.map((record) => ({
		id: record.SOLICITUD_ID,
		nombre: record.DESCRIPCIONFORZADO,
		area: record.AREA_DESCRIPCION,
		subarea: record.SUBAREA_DESCRIPCION,

		tipo: record.SOLICITANTE_B_ID == null ? "alta" : "baja",
		solicitante:
			record.SOLICITANTE_B_ID === null
				? record.NOMBRE_SOLICITANTE_A + " " + record.AP_SOLICITANTE_A + " " + record.AM_SOLICITANTE_A
				: record.NOMBRE_SOLICITANTE_B + " " + record.AP_SOLICITANTE_B + " " + record.AM_SOLICITANTE_B,
		aprobador:
			record.APROBADOR_B_ID === null
				? record.NOMBRE_APROBADOR_A + " " + record.AP_APROBADOR_A + " " + record.AM_APROBADOR_A
				: record.NOMBRE_APROBADOR_B + " " + record.AP_APROBADOR_B + " " + record.AM_APROBADOR_B,
		ejecutor:
			record.EJECUTOR_B_ID === null
				? record.NOMBRE_EJECUTOR_A + " " + record.AP_EJECUTOR_A + " " + record.AM_EJECUTOR_A
				: record.NOMBRE_EJECUTOR_B + " " + record.AP_EJECUTOR_B + " " + record.AM_EJECUTOR_B,

		solicitanteAId: record.SOLICITANTE_A_ID,
		aprobadorAId: record.APROBADOR_A_ID,
		ejecutorAId: record.EJECUTOR_A_ID,
		solicitanteBId: record.SOLICITANTE_B_ID,
		aprobadorBId: record.APROBADOR_B_ID,
		ejecutorBId: record.EJECUTOR_B_ID,

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
		interlock: record.INTERLOCK,
		proyectoDescripcion: record.PROYECTO_DESCRIPCION,
		proyectoId: record.PROYECTO_ID,
		observadoEjecucion: record.OBSERVADO_A,
		desObservacionEjecucion: record.OBSERVACION_RECHAZO,
	}));
};

export async function PUT(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateUpdateQuery(data);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.rowsAffected && result.rowsAffected[0] > 0) {
			const randomString = generateRandomString(5);
			const actionToken = await bcrypt.hash(randomString, 10);
			const updateTokenQuery = `UPDATE TRS_SOLICITUD_FORZADO SET ACTION_TOKEN = '${actionToken}' WHERE SOLICITUD_ID = ${data.id}`;
			await pool.query(updateTokenQuery);

			const updatedSolicitud = await getSingleSolicitud(data.id);
			const updatedSolicitudHtmlAprobador = createSolicitudHTML(updatedSolicitud[0], randomString, data.id, data.usuario, "modificación");
			const updatedSolicitudHtmlOtros = createSolicitudHTMLOtros(updatedSolicitud[0], data.id, data.usuario, "modificación");

			// Obtener los correos de las personas involucradas
			const emailQuery = `
				SELECT UA.CORREO AS aprobadorCorreo,
                    UE.CORREO AS ejecutorCorreo,
                    US.CORREO AS solicitanteCorreo
				FROM TRS_SOLICITUD_FORZADO SF
				LEFT JOIN MAE_USUARIO UA ON SF.APROBADOR_A_ID = UA.USUARIO_ID
				LEFT JOIN MAE_USUARIO UE ON SF.EJECUTOR_A_ID = UE.USUARIO_ID
				LEFT JOIN MAE_USUARIO US ON SF.SOLICITANTE_A_ID = US.USUARIO_ID
				WHERE SF.SOLICITUD_ID = ${data.id}
			`;
			const emailResult = await pool.query(emailQuery);
			const { aprobadorCorreo, ejecutorCorreo, solicitanteCorreo } = emailResult.recordset[0];

			// Enviar correo al aprobador con botones
			const mailOptionsAprobador: MailOptions = {
				from: "test@prot.one",
				to: aprobadorCorreo,
				subject: "[FORZADOS] Una solicitud de forzado ha sido modificada",
				html: updatedSolicitudHtmlAprobador,
			};
			mailer.sendMail(mailOptionsAprobador).catch(console.error);

			const mailOptionsSolicitante: MailOptions = {
				from: "test@prot.one",
				to: solicitanteCorreo,
				subject: "[FORZADOS] Una solicitud de forzado ha sido modificada",
				html: updatedSolicitudHtmlOtros,
			};
			mailer.sendMail(mailOptionsSolicitante).catch(console.error);

			const mailOptionsEjecutor: MailOptions = {
				from: "test@prot.one",
				to: ejecutorCorreo,
				subject: "[FORZADOS] Una solicitud de forzado ha sido modificada",
				html: updatedSolicitudHtmlOtros,
			};
			mailer.sendMail(mailOptionsEjecutor).catch(console.error);

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

		const query = generateInsertQuery(data);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.recordset && result.recordset.length > 0) {
			const insertedId = result.recordset[0].SOLICITUD_ID;

			const randomString = generateRandomString(5);
			const actionToken = await bcrypt.hash(randomString, 10);
			const updateTokenQuery = `UPDATE TRS_SOLICITUD_FORZADO SET ACTION_TOKEN = '${actionToken}' WHERE SOLICITUD_ID = ${insertedId}`;
			await pool.query(updateTokenQuery);

			const newSolicitud = await getSingleSolicitud(insertedId);
			const newSolicitudHtmlAprobador = createSolicitudHTML(newSolicitud[0], randomString, insertedId, data.usuario, "creación");
			const newSolicitudHtmlOtros = createSolicitudHTMLOtros(newSolicitud[0], insertedId, data.usuario, "creación");

			// Obtener los correos de las personas involucradas
			const emailQuery = `
				SELECT UA.CORREO AS aprobadorCorreo,
					   UE.CORREO AS ejecutorCorreo,
					   US.CORREO AS solicitanteCorreo
				FROM TRS_SOLICITUD_FORZADO SF
				LEFT JOIN MAE_USUARIO UA ON SF.APROBADOR_A_ID = UA.USUARIO_ID
				LEFT JOIN MAE_USUARIO UE ON SF.EJECUTOR_A_ID = UE.USUARIO_ID
				LEFT JOIN MAE_USUARIO US ON SF.SOLICITANTE_A_ID = US.USUARIO_ID
				WHERE SF.SOLICITUD_ID = ${insertedId}
			`;
			const emailResult = await pool.query(emailQuery);
			const { aprobadorCorreo, ejecutorCorreo, solicitanteCorreo } = emailResult.recordset[0];

			// Enviar correo al aprobador con botones
			const mailOptionsAprobador: MailOptions = {
				from: "test@prot.one",
				to: aprobadorCorreo,
				subject: "[FORZADOS] Ha sido designado como aprobador en una solicitud de forzado",
				html: newSolicitudHtmlAprobador,
			};
			mailer.sendMail(mailOptionsAprobador).catch(console.error);

			const mailOptionsSolicitante: MailOptions = {
				from: "test@prot.one",
				to: solicitanteCorreo,
				subject: "[FORZADOS] Ha sido designado como solicitante en una solicitud de forzado",
				html: newSolicitudHtmlOtros,
			};
			mailer.sendMail(mailOptionsSolicitante).catch(console.error);

			const mailOptionsEjecutor: MailOptions = {
				from: "test@prot.one",
				to: ejecutorCorreo,
				subject: "[FORZADOS] Ha sido designado como ejecutor en una solicitud de forzado",
				html: newSolicitudHtmlOtros,
			};
			mailer.sendMail(mailOptionsEjecutor).catch(console.error);

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
	proyecto: string;
	tagPrefijo: string;
	tagCentro: string;
	tagSubfijo: string;
	descripcion: string;
	disciplina: string;
	turno: string;
	interlockSeguridad: string;
	responsable: string;
	riesgo: string;
	riesgoA: string;
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
    PROYECTO_ID,
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
    ${parameters.proyecto}, -- PROYECTO_JD
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
    '${parameters.descripcion.toUpperCase()}', -- DESCRIPCIONFORZADO
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
        PROYECTO_ID = ${parameters.proyecto},
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

        SOLICITANTE_A_ID = ${parameters.solicitante},
        APROBADOR_A_ID = ${parameters.aprobador},
        EJECUTOR_A_ID = ${parameters.ejecutor},

		USUARIO_MODIFICACION = '${parameters.usuario}',
		FECHA_MODIFICACION = GETDATE(),

		ESTADOSOLICITUD = 'PENDIENTE-ALTA'
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
const createSolicitudHTML = (solicitud: ResumenSolicitud, actionToken: string, insertedId: string, usuario: string, tipo: string) => {
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
            background-color: #103483;
            color: #ffffff !important; /* Blanco puro */
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .button-reject {
            background-color: #d9534f;
            color: #ffffff !important; /* Blanco puro */
        }
        .button-reject:hover {
            background-color: #c9302c;
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
        <h1>Resumen de (${tipo}) de solicitud</h1>
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
        <a href="http${process.env.NODE_ENV == "production" ? "s" : ""}://${process.env.HOSTNAME}/acciones/aprobar/alta?token=${actionToken}&id=${insertedId}&bxs=${usuario}" class="button">Aprobar</a>
        <a href="http${process.env.NODE_ENV == "production" ? "s" : ""}://${
		process.env.HOSTNAME
	}/acciones/rechazar/alta?token=${actionToken}&id=${insertedId}&bxs=${usuario}" class="button button-reject">Rechazar</a>
    </div>
</body>
</html>
    `;
};

const createSolicitudHTMLOtros = (solicitud: ResumenSolicitud, insertedId: string, usuario: string, tipo: string) => {
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
                    background-color: #103483;
                    color: #ffffff !important; /* Blanco puro */
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                .button-reject {
                    background-color: #d9534f;
                    color: #ffffff !important; /* Blanco puro */
                }
                .button-reject:hover {
                    background-color: #c9302c;
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
                <h1>Resumen de (${tipo}) de solicitud</h1>
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
            </div>
        </body>
		</html>
	`;
};
