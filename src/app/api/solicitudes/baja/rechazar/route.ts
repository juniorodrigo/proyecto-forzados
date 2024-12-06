import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, motivoRechazo, usuario } = await request.json();

		console.log("id:", id, "motivoRechazo:", motivoRechazo);

		const result = await pool.request().input("id", id).input("motivoRechazo", motivoRechazo).input("usuario", usuario).query(`
				UPDATE TRS_Solicitud_forzado 
				SET 
					ESTADOSOLICITUD = 'RECHAZADO-BAJA', 
					MOTIVORECHAZO_B_ID = @motivoRechazo, 
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
