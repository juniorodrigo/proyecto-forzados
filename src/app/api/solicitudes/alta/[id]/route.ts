import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const solicitud = await getSingleSolicitud(id);
		return NextResponse.json({ success: true, message: "Records fetched successfully", data: solicitud });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Failed to fetch records" }, { status: 500 });
	}
}

const getSingleSolicitud = async (id: string) => {
	const pool = await poolPromise;
	const result = await pool.query(`
        SELECT 
            SOLICITUD_ID,
            SUBAREA_ID,
            DISCIPLINA_ID,
            TURNO_ID,
            MOTIVORECHAZO_A_ID,
            MOTIVORECHAZO_B_ID,
            TIPOFORZADO_ID,
            TAGCENTRO_ID,
			TAGSUFIJO,
            RESPONSABLE_ID,
            RIESGOA_ID,
            TIPOSOLICITUD,
            INTERLOCK,
            DESCRIPCIONFORZADO,
            FECHAEJECUCION_A,
			FECHAEJECUCION_B,
            FECHACIERRE,
            USUARIO_CREACION,
            FECHA_CREACION,
            USUARIO_MODIFICACION,
            FECHA_MODIFICACION,
            ESTADOSOLICITUD,
			APROBADOR_A_ID,
			EJECUTOR_A_ID,
			SOLICITANTE_A_ID
        FROM 
            TRS_SOLICITUD_FORZADO
        WHERE 
            SOLICITUD_ID = ${id}
    `);
	return result.recordset.map((record) => ({
		id: record.SOLICITUD_ID,
		tagPrefijo: record.SUBAREA_ID,
		tagCentro: record.TAGCENTRO_ID,
		tagSubfijo: record.TAGSUFIJO,
		descripcion: record.DESCRIPCIONFORZADO,
		disciplina: record.DISCIPLINA_ID,
		turno: record.TURNO_ID,
		interlockSeguridad: record.INTERLOCK,
		responsable: record.RESPONSABLE_ID,
		riesgo: record.RIESGOA_ID,
		probabilidad: record.RIESGOA_ID,
		impacto: record.RIESGOA_ID,

		solicitante: record.SOLICITANTE_A_ID,
		aprobador: record.APROBADOR_A_ID,
		ejecutor: record.EJECUTOR_A_ID,

		autorizacion: record.ESTADOSOLICITUD,
		tipoForzado: record.TIPOFORZADO_ID,
	}));
};
