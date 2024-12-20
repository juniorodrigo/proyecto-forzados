import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método POST
export async function POST(request: Request) {
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
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
	}
}

type UpdateQueryParameters = {
	id: string;
	solicitanteRetiro: string;
	aprobadorRetiro: string;
	ejecutorRetiro: string;
	observaciones: string;
	usuario: string;
};

const generateUpdateQuery = (parameters: UpdateQueryParameters) => {
	return `UPDATE TRS_SOLICITUD_FORZADO SET
		SOLICITANTE_B_ID = ${parameters.solicitanteRetiro},
		APROBADOR_B_ID = ${parameters.aprobadorRetiro},
		EJECUTOR_B_ID = ${parameters.ejecutorRetiro},
		OBSERVACIONES_B = '${parameters.observaciones}',
		-- FECHACIERRE = '${1}',

		USUARIO_MODIFICACION = '${parameters.usuario}',
		FECHA_MODIFICACION = GETDATE(),
		ESTADOSOLICITUD = 'PENDIENTE-BAJA'
		
	WHERE SOLICITUD_ID = ${parameters.id};`;
};
