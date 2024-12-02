import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, usuario } = await request.json();

		const result = await pool
			.request()
			.input("id", id)
			.input("usuario", usuario)
			.input("fechaModificacion", new Date())
			.query("UPDATE TRS_Solicitud_forzado SET ESTADOSOLICITUD = 'APROBADO-ALTA', USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = @fechaModificacion WHERE SOLICITUD_ID = @id");

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
