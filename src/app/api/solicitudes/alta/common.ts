import { poolPromise } from "@sql/lib/db";

// Obtener una sola solicitud
export const getSingleSolicitud = async (id: string) => {
	const pool = await poolPromise;
	const result = await pool.query(`
SELECT SF.DESCRIPCIONFORZADO,
       SF.ESTADOSOLICITUD,
       SF.FECHAEJECUCION_A,
       SF.FECHACIERRE,
       SF.APROBADOR_A_ID,

       UXAP.CORREO                                                      AS APROBADOR_A_CORREO,
       (UXAP.NOMBRE + ' ' + UXAP.APEPATERNO + ' ' + UXAP.APEMATERNO)    AS APROBADOR_A_NOMBRE,
       SF.EJECUTOR_A_ID,
       UXEJ.CORREO                                                      AS EJECUTOR_A_CORREO,
       (UXEJ.NOMBRE + ' ' + UXEJ.APEPATERNO + ' ' + UXEJ.APEMATERNO)    AS EJECUTOR_A_NOMBRE,
       SF.SOLICITANTE_A_ID,
       UXSO.CORREO                                                      AS SOLICITANTE_A_CORREO,
       (UXSO.NOMBRE + ' ' + UXSO.APEPATERNO + ' ' + UXSO.APEMATERNO)    AS SOLICITANTE_A_NOMBRE,

       UXBAP.CORREO                                                     AS APROBADOR_B_CORREO,
       (UXBAP.NOMBRE + ' ' + UXBAP.APEPATERNO + ' ' + UXBAP.APEMATERNO) AS APROBADOR_B_NOMBRE,
       SF.EJECUTOR_A_ID,
       UXBEJ.CORREO                                                     AS EJECUTOR_B_CORREO,
       (UXBEJ.NOMBRE + ' ' + UXBEJ.APEPATERNO + ' ' + UXBEJ.APEMATERNO) AS EJECUTOR_B_NOMBRE,
       SF.SOLICITANTE_A_ID,
       UXBSO.CORREO                                                     AS SOLICITANTE_B_CORREO,
       (UXBSO.NOMBRE + ' ' + UXBSO.APEPATERNO + ' ' + UXBSO.APEMATERNO) AS SOLICITANTE_B_NOMBRE,

       SA.CODIGO                                                        AS SUBAREA_CODIGO,
       SA.DESCRIPCION                                                   AS SUBAREA_DESCRIPCION,
       D.DESCRIPCION                                                    AS DISCIPLINA_DESCRIPCION,
       T.DESCRIPCION                                                    AS TURNO_DESCRIPCION,
       SF.MOTIVORECHAZO_A_ID,
       MRA.DESCRIPCION                                                  AS MOTIVORECHAZO_A_DESCRIPCION,

       SF.MOTIVORECHAZO_B_ID,
       MRA.DESCRIPCION                                                  AS MOTIVORECHAZO_B_DESCRIPCION,

       TF.DESCRIPCION                                                   AS TIPOFORZADO_DESCRIPCION,
       TC.CODIGO                                                        AS TAGCENTRO_CODIGO,
       TC.DESCRIPCION                                                   AS TAGCENTRO_DESCRIPCION,
       R.NOMBRE                                                         AS RESPONSABLE_NOMBRE,
       RA.DESCRIPCION                                                   AS RIESGOA_DESCRIPCION

FROM TRS_SOLICITUD_FORZADO SF
         LEFT JOIN
     SUB_AREA SA ON SF.SUBAREA_ID = SA.SUBAREA_ID
         LEFT JOIN
     DISCIPLINA D ON SF.DISCIPLINA_ID = D.DISCIPLINA_ID
         LEFT JOIN
     TURNO T ON SF.TURNO_ID = T.TURNO_ID
         LEFT JOIN
     MOTIVO_RECHAZO MRA ON SF.MOTIVORECHAZO_A_ID = MRA.MOTIVORECHAZO_ID
         LEFT JOIN
     MOTIVO_RECHAZO MRB ON SF.MOTIVORECHAZO_A_ID = MRB.MOTIVORECHAZO_ID
         LEFT JOIN
     TIPO_FORZADO TF ON SF.TIPOFORZADO_ID = TF.TIPOFORZADO_ID
         LEFT JOIN
     TAG_CENTRO TC ON SF.TAGCENTRO_ID = TC.TAGCENTRO_ID
         LEFT JOIN
     RESPONSABLE R ON SF.RESPONSABLE_ID = R.RESPONSABLE_ID
         LEFT JOIN
     MAE_RIESGO_A RA ON SF.RIESGOA_ID = RA.RIESGOA_ID
         LEFT JOIN
     MAE_USUARIO UXAP ON SF.APROBADOR_A_ID = UXAP.USUARIO_ID
         LEFT JOIN
     MAE_USUARIO UXSO ON SF.SOLICITANTE_A_ID = UXSO.USUARIO_ID
         LEFT JOIN
     MAE_USUARIO UXEJ ON SF.EJECUTOR_A_ID = UXEJ.USUARIO_ID
         LEFT JOIN
     MAE_USUARIO UXBAP ON SF.APROBADOR_A_ID = UXBAP.USUARIO_ID
         LEFT JOIN
     MAE_USUARIO UXBSO ON SF.SOLICITANTE_A_ID = UXBSO.USUARIO_ID
         LEFT JOIN
     MAE_USUARIO UXBEJ ON SF.EJECUTOR_A_ID = UXBEJ.USUARIO_ID
WHERE SF.SOLICITUD_ID = ${id}
	`);
	return result.recordset.map((record) => ({
		descripcion: typeof record.DESCRIPCIONFORZADO === "string" ? record.DESCRIPCIONFORZADO.toUpperCase() : null,
		estadoSolicitud: typeof record.ESTADOSOLICITUD === "string" ? record.ESTADOSOLICITUD.toUpperCase() : null,
		fechaRealizacion: typeof record.FECHAEJECUCION_A === "string" ? record.FECHAEJECUCION_A.toUpperCase() : null,
		fechaCierre: typeof record.FECHACIERRE === "string" ? record.FECHACIERRE.toUpperCase() : null,
		aprobadorId: typeof record.APROBADOR_A_ID === "string" ? record.APROBADOR_A_ID.toUpperCase() : null,
		aprobadorNombre: typeof record.APROBADOR_A_NOMBRE === "string" ? record.APROBADOR_A_NOMBRE.toUpperCase() : null,
		ejecutorId: typeof record.EJECUTOR_A_ID === "string" ? record.EJECUTOR_A_ID.toUpperCase() : null,
		ejecutorNombre: typeof record.EJECUTOR_A_NOMBRE === "string" ? record.EJECUTOR_A_NOMBRE.toUpperCase() : null,
		solicitanteId: typeof record.SOLICITANTE_A_ID === "string" ? record.SOLICITANTE_A_ID.toUpperCase() : null,
		solicitanteNombre: typeof record.SOLICITANTE_A_NOMBRE === "string" ? record.SOLICITANTE_A_NOMBRE.toUpperCase() : null,
		subareaCodigo: typeof record.SUBAREA_CODIGO === "string" ? record.SUBAREA_CODIGO.toUpperCase() : null,
		subareaDescripcion: typeof record.SUBAREA_DESCRIPCION === "string" ? record.SUBAREA_DESCRIPCION.toUpperCase() : null,
		disciplinaDescripcion: typeof record.DISCIPLINA_DESCRIPCION === "string" ? record.DISCIPLINA_DESCRIPCION.toUpperCase() : null,
		turnoDescripcion: typeof record.TURNO_DESCRIPCION === "string" ? record.TURNO_DESCRIPCION.toUpperCase() : null,
		motivoRechazoDescripcion: typeof record.MOTIVORECHAZO_A_DESCRIPCION === "string" ? record.MOTIVORECHAZO_A_DESCRIPCION.toUpperCase() : null,
		tipoForzadoDescripcion: typeof record.TIPOFORZADO_DESCRIPCION === "string" ? record.TIPOFORZADO_DESCRIPCION.toUpperCase() : null,
		tagCentroCodigo: typeof record.TAGCENTRO_CODIGO === "string" ? record.TAGCENTRO_CODIGO.toUpperCase() : null,
		tagCentroDescripcion: typeof record.TAGCENTRO_DESCRIPCION === "string" ? record.TAGCENTRO_DESCRIPCION.toUpperCase() : null,
		responsableNombre: typeof record.RESPONSABLE_NOMBRE === "string" ? record.RESPONSABLE_NOMBRE.toUpperCase() : null,
		riesgoDescripcion: typeof record.RIESGOA_DESCRIPCION === "string" ? record.RIESGOA_DESCRIPCION.toUpperCase() : null,
		aprobadorACorreo: typeof record.APROBADOR_A_CORREO === "string" ? record.APROBADOR_A_CORREO.toUpperCase() : null,
		ejecutorACorreo: typeof record.EJECUTOR_A_CORREO === "string" ? record.EJECUTOR_A_CORREO.toUpperCase() : null,
		solicitanteACorreo: typeof record.SOLICITANTE_A_CORREO === "string" ? record.SOLICITANTE_A_CORREO.toUpperCase() : null,
		aprobadorBCorreo: typeof record.APROBADOR_B_CORREO === "string" ? record.APROBADOR_B_CORREO.toUpperCase() : null,
		aprobadorBNombre: typeof record.APROBADOR_B_NOMBRE === "string" ? record.APROBADOR_B_NOMBRE.toUpperCase() : null,
		ejecutorBCorreo: typeof record.EJECUTOR_B_CORREO === "string" ? record.EJECUTOR_B_CORREO.toUpperCase() : null,
		ejecutorBNombre: typeof record.EJECUTOR_B_NOMBRE === "string" ? record.EJECUTOR_B_NOMBRE.toUpperCase() : null,
		solicitanteBCorreo: typeof record.SOLICITANTE_B_CORREO === "string" ? record.SOLICITANTE_B_CORREO.toUpperCase() : null,
		solicitanteBNombre: typeof record.SOLICITANTE_B_NOMBRE === "string" ? record.SOLICITANTE_B_NOMBRE.toUpperCase() : null,
		motivoRechazoBDescripcion: typeof record.MOTIVORECHAZO_B_DESCRIPCION === "string" ? record.MOTIVORECHAZO_B_DESCRIPCION.toUpperCase() : null,
	}));
};
