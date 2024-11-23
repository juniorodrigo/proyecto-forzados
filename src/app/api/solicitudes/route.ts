import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function GET() {
	try {
		const query = `SELECT * FROM FORZADO`;

		const pool = await poolPromise;
		const results = (await pool.query(query)).recordset;

		console.log(results);

		return NextResponse.json({ message: "GET request successful" });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
