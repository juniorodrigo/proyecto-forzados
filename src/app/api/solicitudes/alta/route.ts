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
			SF.SOLICITUD_ID,
			SF.DESCRIPCIONFORZADO,
			SF.ESTADOSOLICITUD,
			SF.FECHA_CREACION,
			SA.DESCRIPCION AS SUBAREA_DESCRIPCION,
			SF.USUARIO_CREACION AS SOLICITANTE
		FROM 
			TRS_SOLICITUD_FORZADO SF
		LEFT JOIN 
			SUB_AREA SA ON SF.SUBAREA_ID = SA.SUBAREA_ID
	`);
	return result.recordset.map((record) => ({
		id: record.SOLICITUD_ID,
		nombre: record.DESCRIPCIONFORZADO,
		area: record.SUBAREA_DESCRIPCION,
		solicitante: record.SOLICITANTE,
		estado: record.ESTADOSOLICITUD,
		fecha: record.FECHA_CREACION,
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
