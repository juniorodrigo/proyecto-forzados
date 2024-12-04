import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;

		const solicitud = await getSingleSolicitud(id);
		return NextResponse.json({ success: true, message: "Records fetched successfully", data: solicitud[0] });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Failed to fetch records" }, { status: 500 });
	}
}

const getSingleSolicitud = async (id: string) => {
	const pool = await poolPromise;
	const result = await pool.query(`
        SELECT 
			EJECUTOR_B_ID,
			APROBADOR_B_ID,
			SOLICITANTE_B_ID,
			OBSERVACIONES_B
        FROM 
            TRS_SOLICITUD_FORZADO
        WHERE 
            SOLICITUD_ID = ${id}
    `);

	return result.recordset.map((record) => ({
		solicitante: record.SOLICITANTE_B_ID,
		aprobador: record.APROBADOR_B_ID,
		ejecutor: record.EJECUTOR_B_ID,
		observaciones: record.OBSERVACIONES_B,
	}));
};
