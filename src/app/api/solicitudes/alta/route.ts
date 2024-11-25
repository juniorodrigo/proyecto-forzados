import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	// Obtener todas las solicitudes de alta
	return NextResponse.json({ message: "GET request successful" });
}

// Manejo del método POST
export async function POST(request: Request) {
	try {
		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateInsertQuery(data);

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
	ESTADOSOLICITUD,
	FECHAREALIZACION,
	FECHACIERRE,
	USUARIO_CREACION,
	FECHA_CREACION,
	USUARIO_MODIFICACION,
	FECHA_MODIFICACION
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
	NULL, -- ESTADOSOLICITUD
	NULL, -- FECHAREALIZACION
	NULL, -- FECHACIERRE
	'${parameters.solicitante}', -- USUARIO_CREACION
	GETDATE(), -- FECHA_CREACION
	'${parameters.aprobador}', -- USUARIO_MODIFICACION
	GETDATE() -- FECHA_MODIFICACION
);`;
};
