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
		/* 
		1. Se reciben los parámetros
		2. Se almacenan en la db
		3. Se envía correo electrónico
		*/

		const data = await request.json();
		console.log(data);

		// generar el query
		const query = generateInsertQuery(data);

		const pool = await poolPromise;
		const result = await pool.query(query);

		if (result.rowsAffected && result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record inserted successfully", data });

			// Enviar correo electrónico: sacarlo del átomo o de la ruta que trae la info del usuario
		} else {
			return NextResponse.json({ success: false, message: "Failed to insert record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

type InsertQueryParameters = {
	idSubarea: number;
	idActivo: number;
	idDisciplina: number;
	idTurno: number;
	idResponsable: number;
	idRiesgo: number;
	idProbabilidad: number;
	idImpacto: number;
	idSolicitante: number;
	idAprobador: number;
	idEjecutor: number;
	idTipo: number;
	descripcion: string;
	interlockSeguridad: string;
	autorizacion: string;
	fechaRealizacion: string;
	idSolicitanteR: number;
	idAprobadorR: number;
	idEjecutorR: number;
	autorizacionR: string;
	fechaCierre: string;
	idCreator: number;
	idMR: number | null;
};

const generateInsertQuery = (parameters: InsertQueryParameters) => {
	return `INSERT INTO FORZADO (
	ID_SUBAREA,
	ID_ACTIVO,
	ID_DISCIPLINA,
	ID_TURNO,
	ID_RESPONSABLE,
	ID_RIESGO,
	ID_PROBABILIDAD,
	ID_IMPACTO,
	ID_SOLICITANTE,
	ID_APROBADOR,
	ID_EJECUTOR,
	ID_TIPO,
	DESCRIPCION,
	INTERLOCK,
	AUTORIZACION,
	FECHA_REALIZACION,
	ID_SOLICITANTE_R,
	ID_APROBADOR_R,
	ID_EJECUTOR_R,
	AUTORIZACION_R,
	FECHA_CIERRE,
	ID_CREATOR,
	ID_MR
)
VALUES (
	${parameters.idSubarea}, -- ID_SUBAREA
	${parameters.idActivo}, -- ID_ACTIVO
	${parameters.idDisciplina}, -- ID_DISCIPLINA
	${parameters.idTurno}, -- ID_TURNO
	${parameters.idResponsable}, -- ID_RESPONSABLE
	${parameters.idRiesgo}, -- ID_RIESGO
	${parameters.idProbabilidad}, -- ID_PROBABILIDAD
	${parameters.idImpacto}, -- ID_IMPACTO
	${parameters.idSolicitante}, -- ID_SOLICITANTE
	${parameters.idAprobador}, -- ID_APROBADOR
	${parameters.idEjecutor}, -- ID_EJECUTOR
	${parameters.idTipo}, -- ID_TIPO
	'${parameters.descripcion}', -- DESCRIPCION
	'${parameters.interlockSeguridad}', -- INTERLOCK
	'${parameters.autorizacion}', -- AUTORIZACION
	'${parameters.fechaRealizacion}', -- FECHA_REALIZACION
	${parameters.idSolicitanteR}, -- ID_SOLICITANTE_R
	${parameters.idAprobadorR}, -- ID_APROBADOR_R
	${parameters.idEjecutorR}, -- ID_EJECUTOR_R
	'${parameters.autorizacionR}', -- AUTORIZACION_R
	'${parameters.fechaCierre}', -- FECHA_CIERRE
	${parameters.idCreator}, -- ID_CREATOR
	${parameters.idMR} -- ID_MR (puede ser NULL si es opcional)
);`;
};
