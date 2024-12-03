import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db"; // Importar poolPromise para la conexión a la base de datos

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		const pool = await poolPromise;
		const { recordset } = await pool
			.request()
			.input("id", id)
			.query(
				"SELECT USX.*,  AR.DESCRIPCION AS ADESC, RO.DESCRIPCION as RODESC FROM MAE_USUARIO USX LEFT JOIN MAE_AREA AR ON  USX.AREA_ID = AR.AREA_ID LEFT JOIN MAE_ROL RO ON USX.ROL_ID = RO.ROL_ID WHERE USUARIO = @id"
			);
		if (recordset.length === 0) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		const userData = {
			id: recordset[0].USUARIO_ID,
			name: recordset[0].NOMBRE + " " + recordset[0].APEPATERNO + " " + recordset[0].APEMATERNO,
			area: recordset[0].ADESC,
			role: recordset[0].ROL_ID,
			jwt: "", // Asignar el valor adecuado para jwt si es necesario
		};
		return NextResponse.json(userData, { status: 200 });
	} catch (error) {
		console.error("Error fetching user data:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
