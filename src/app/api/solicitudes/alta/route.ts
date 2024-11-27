import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const solicitudes = await getAllSolicitudes();
		return NextResponse.json({ success: true, message: "Records fetched successfully", data: solicitudes });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Failed to fetch records" }, { status: 500 });
	}
}

// Manejo del método POST
export async function POST(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateInsertQuery(data);
		console.log(query);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.rowsAffected && result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record inserted successfully", data });
		} else {
			return NextResponse.json({ success: false, message: "Failed to insert record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

// Manejo del método PUT
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

const getAllSolicitudes = async () => {
	const pool = await poolPromise;
	const result = await pool.query(`
SELECT
    SF.DESCRIPCIONFORZADO,
    SF.ESTADOSOLICITUD,
    SF.FECHAREALIZACION,
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
    RA.DESCRIPCION AS RIESGOA_DESCRIPCION

FROM
    TRS_SOLICITUD_FORZADO SF
LEFT JOIN
    SUB_AREA SA ON SF.SUBAREA_ID = SA.SUBAREA_ID
LEFT JOIN
    DISCIPLINA D ON SF.DISCIPLINA_ID = D.DISCIPLINA_ID
LEFT JOIN
    TURNO T ON SF.TURNO_ID = T.TURNO_ID
LEFT JOIN
    MOTIVO_RECHAZO MR ON SF.MOTIVORECHAZO_ID = MR.MOTIVORECHAZO_ID
LEFT JOIN
    TIPO_FORZADO TF ON SF.TIPOFORZADO_ID = TF.TIPOFORZADO_ID
LEFT JOIN
    TAG_CENTRO TC ON SF.TAGCENTRO_ID = TC.TAGCENTRO_ID
LEFT JOIN
    RESPONSABLE R ON SF.RESPONSABLE_ID = R.RESPONSABLE_ID
LEFT JOIN
    MAE_RIESGO_A RA ON SF.RIESGOA_ID = RA.RIESGOA_ID
	`);
	return result.recordset.map((record) => ({
		id: record.SOLICITUD_ID,
		nombre: record.DESCRIPCIONFORZADO,
		area: record.SUBAREA_DESCRIPCION,
		solicitante: record.SOLICITANTE,
		estado: record.ESTADOSOLICITUD,
		fecha: record.FECHA_CREACION,
		descripcion: record.DESCRIPCIONFORZADO,
		estadoSolicitud: record.ESTADOSOLICITUD,
		fechaRealizacion: record.FECHAREALIZACION,
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
	impacto: string;
	solicitante: string;
	aprobador: string;
	ejecutor: string;
	autorizacion: string;
	tipoForzado: string;
};

const generateInsertQuery = (parameters: InsertQueryParameters) => {
	return `INSERT INTO TRS_SOLICITUD_FORZADO (
	SUBAREA_ID,
	DISCIPLINA_ID,
	TURNO_ID,
	MOTIVORECHAZO_ID,
	TIPOFORZADO_ID,
	TAGCENTRO_ID,
	RESPONSABLE_ID,
	RIESGOA_ID,
	TIPOSOLICITUD,
	INTERLOCK,
	DESCRIPCIONFORZADO,
	FECHAREALIZACION,
	FECHACIERRE,
	USUARIO_CREACION,
	FECHA_CREACION,
	USUARIO_MODIFICACION,
	FECHA_MODIFICACION,
	ESTADOSOLICITUD
)
VALUES (
	${parameters.tagPrefijo}, -- SUBAREA_ID
	${parameters.disciplina}, -- DISCIPLINA_ID
	${parameters.turno}, -- TURNO_ID
	NULL, -- MOTIVORECHAZO_ID
	${parameters.tipoForzado}, -- TIPOFORZADO_ID
	${parameters.tagCentro}, -- TAGCENTRO_ID
	${parameters.responsable}, -- RESPONSABLE_ID
	${parameters.riesgo}, -- RIESGOA_ID
	NULL, -- TIPOSOLICITUD
	${parameters.interlockSeguridad === "SÍ" ? 1 : 0}, -- INTERLOCK
	'${parameters.descripcion}', -- DESCRIPCIONFORZADO
	NULL, -- FECHAREALIZACION
	NULL, -- FECHACIERRE
	'${parameters.solicitante}', -- USUARIO_CREACION
	GETDATE(), -- FECHA_CREACION
	'${parameters.aprobador}', -- USUARIO_MODIFICACION
	GETDATE(), -- FECHA_MODIFICACION
	'pendiente' -- ESTADOSOLICITUD
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
		RESPONSABLE_ID = ${parameters.responsable},
		RIESGOA_ID = ${parameters.riesgo},
		INTERLOCK = ${parameters.interlockSeguridad === "SÍ" ? 1 : 0},
		DESCRIPCIONFORZADO = '${parameters.descripcion}',
		USUARIO_MODIFICACION = '${parameters.aprobador}',
		FECHA_MODIFICACION = GETDATE(),
		ESTADOSOLICITUD = 'pendiente'
	WHERE SOLICITUD_ID = ${parameters.id};`;
};
