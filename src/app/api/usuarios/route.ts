import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// TAG CENTRO_______________________________________________________________

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT USUARIO_ID, NOMBRE,APEPATERNPO, APEMATERNO FROM MAE_USUARIO");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.USUARIO_ID,
				nombre: singleValue.NOMBRE + " " + singleValue.APEPATERNPO + " " + singleValue.APEMATERNO,
			};
		});
		return NextResponse.json({ success: true, values: turnos });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}
