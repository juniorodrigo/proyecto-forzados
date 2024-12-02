import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
		}

		const pool = await poolPromise;
		const { recordset } = await pool.request().input("id", id).query("SELECT * FROM PROBABILIDAD WHERE PROBABILIDAD_ID = @id AND ESTADO = 1");

		if (recordset.length === 0) {
			return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
		}

		const record = recordset[0];
		const result = {
			id: record.PROBABILIDAD_ID,
			descripcion: record.DESCRIPCION,
		};

		return NextResponse.json({ success: true, value: result });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}
