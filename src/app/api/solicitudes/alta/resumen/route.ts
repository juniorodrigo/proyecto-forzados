import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params; // Extraer el valor de "id" desde los parámetros de la URL

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
        SF.DESCRIPCIONFORZADO,
        SF.ESTADOSOLICITUD,
        SF.FECHAEJECUCION_A,
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
    WHERE 
        SF.SOLICITUD_ID = ${id}
    `);
	return result.recordset.map((record) => ({
		descripcion: record.DESCRIPCIONFORZADO,
		estadoSolicitud: record.ESTADOSOLICITUD,
		fechaRealizacion: record.FECHAEJECUCION_A,
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
