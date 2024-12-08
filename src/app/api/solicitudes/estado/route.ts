import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db"; // Importar poolPromise para la conexión a la base de datos

export async function POST(req: NextRequest) {
	try {
		const { estado } = await req.json();
		const pool = await poolPromise;
		const { recordset } = await pool.request().input("estado", estado).query("SELECT * FROM TRS_SOLICITUD_FORZADO WHERE ESTADOSOLICITUD = @estado");
		if (recordset.length === 0) {
			return NextResponse.json({ error: "Estado no válido" }, { status: 404 });
		}
		const datax = {
			solicitudId: recordset[0].SOLICITUD_ID,
			subareaId: recordset[0].SUBAREA_ID,
			disciplinaId: recordset[0].DISCIPLINA_ID,
			turnoId: recordset[0].TURNO_ID,
			motivoRechazoAId: recordset[0].MOTIVORECHAZO_A_ID,
			motivoRechazoBId: recordset[0].MOTIVORECHAZO_B_ID,
			tipoForzadoId: recordset[0].TIPOFORZADO_ID,
			tagCentroId: recordset[0].TAGCENTRO_ID,
			tagSufijo: recordset[0].TAGSUFIJO,
			responsableId: recordset[0].RESPONSABLE_ID,
			riesgoAId: recordset[0].RIESGOA_ID,
			probabilidadRiesgo: recordset[0].PROBABILIDAD_RIESGO,
			tipoSolicitud: recordset[0].TIPOSOLICITUD,
			interlock: recordset[0].INTERLOCK,
			urgencia: recordset[0].URGENCIA,
			descripcionForzado: recordset[0].DESCRIPCIONFORZADO,
			estadoSolicitud: recordset[0].ESTADOSOLICITUD,
			fechaEjecucionA: recordset[0].FECHAEJECUCION_A,
			fechaEjecucionB: recordset[0].FECHAEJECUCION_B,
			fechaCierre: recordset[0].FECHACIERRE,
			solicitanteAId: recordset[0].SOLICITANTE_A_ID,
			aprobadorAId: recordset[0].APROBADOR_A_ID,
			ejecutorAId: recordset[0].EJECUTOR_A_ID,
			solicitanteBId: recordset[0].SOLICITANTE_B_ID,
			aprobadorBId: recordset[0].APROBADOR_B_ID,
			ejecutorBId: recordset[0].EJECUTOR_B_ID,
			usuarioCreacion: recordset[0].USUARIO_CREACION,
			fechaCreacion: recordset[0].FECHA_CREACION,
			usuarioModificacion: recordset[0].USUARIO_MODIFICACION,
			fechaModificacion: recordset[0].FECHA_MODIFICACION,
			observacionesB: recordset[0].OBSERVACIONES_B,
		};
		return NextResponse.json(datax, { status: 200 });
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
