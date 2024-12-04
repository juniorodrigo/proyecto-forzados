import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;

		const { id, usuario, fechaEjecucion } = await request.json();

		// Convertir fechaEjecucion a un objeto Date
		const fechaEjecucionDate = new Date(fechaEjecucion);

		// Verificar si la fecha es válida
		if (isNaN(fechaEjecucionDate.getTime())) {
			return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
		}

		const result = await pool.request().input("id", id).input("usuario", usuario).input("fechaEjecucion", fechaEjecucionDate).query(`
				UPDATE TRS_Solicitud_forzado 
				SET 
					ESTADOSOLICITUD = 'EJECUTADO-ALTA',
					FECHAEJECUCION_A = @fechaEjecucion,
					FECHA_MODIFICACION = GETDATE(),
					USUARIO_MODIFICACION = @usuario
				WHERE SOLICITUD_ID = @id
			`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error inserting data" }, { status: 500 });
	}
}
