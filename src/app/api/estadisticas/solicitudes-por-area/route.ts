import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query(`
			SELECT
				AR.DESCRIPCION,
				COUNT(*) AS TOTAL_OCURRENCIAS
			FROM
				TRS_SOLICITUD_FORZADO SF
			LEFT JOIN dbo.SUB_AREA AR ON SF.SUBAREA_ID =  AR.SUBAREA_ID
			GROUP BY
				AR.DESCRIPCION

			ORDER BY
				TOTAL_OCURRENCIAS DESC;`);

		const stats: { [key: string]: number } = {};

		recordset.forEach((singleValue) => {
			stats[singleValue.DESCRIPCION] = singleValue.TOTAL_OCURRENCIAS;
		});

		return NextResponse.json({ success: true, data: stats });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}