import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function PUT(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, usuario } = await request.json();
		const result = await pool
			.request()
			.input("id", id)
			.input("usuario", usuario)
			.query("UPDATE MAE_USUARIO SET FLAG_INGRESO = '1', USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE USUARIO_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found to update" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}
