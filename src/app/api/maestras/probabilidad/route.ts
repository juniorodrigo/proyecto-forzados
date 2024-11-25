import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// TAG CENTRO_______________________________________________________________

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM PROBABILIDAD");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.PROBABILIDAD_ID,
				descripcion: singleValue.DESCRIPCION,
			};
		});
		return NextResponse.json({ success: true, values: turnos });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}

// Manejo del método POST
export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { descripcion } = await request.json();
		const result = await pool.request().input("descripcion", descripcion).query("INSERT INTO PROBABILIDAD ( DESCRIPCION) VALUES ( @descripcion)");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "values inserted into database" });
		} else {
			return NextResponse.json({ success: false, message: "no values inserted" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error inserting data" }, { status: 500 });
	}
}

// Manejo del método DELETE
export async function DELETE(request: Request) {
	try {
		const pool = await poolPromise;
		const { id } = await request.json();
		const result = await pool.request().input("id", id).query("DELETE FROM PROBABILIDAD WHERE PROBABILIDAD_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record deleted successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found to delete" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing DELETE:", error);
		return NextResponse.json({ success: false, message: "Error deleting data" }, { status: 500 });
	}
}
