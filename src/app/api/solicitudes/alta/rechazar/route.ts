import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, motivoRechazo } = await request.json();
		const result = await pool
			.request()
			.input("id", id)
			.input("motivoRechazo", motivoRechazo)
			.query("UPDATE TRS_Solicitud_forzado SET ESTADOSOLICITUD = 'rechazado-alta', MOTIVORECHAZO_ID = @motivoRechazo WHERE SOLICITUD_ID = @id");

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
