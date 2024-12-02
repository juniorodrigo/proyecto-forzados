import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM RESPONSABLE WHERE ESTADO = 1");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.RESPONSABLE_ID,
				nombre: singleValue.NOMBRE,
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
		const { descripcion, usuario } = await request.json();

		const result = await pool
			.request()
			.input("NOMBRE", descripcion)
			.input("USUARIO_CREACION", usuario)
			.input("USUARIO_MODIFICACION", usuario)
			.query(
				"INSERT INTO RESPONSABLE (NOMBRE, USUARIO_CREACION, USUARIO_MODIFICACION, FECHA_CREACION, FECHA_MODIFICACION, ESTADO) VALUES (@NOMBRE, @USUARIO_CREACION, @USUARIO_MODIFICACION, GETDATE(), GETDATE(), 1)"
			);

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
		const { id, usuario } = await request.json();
		const result = await pool
			.request()
			.input("RESPONSABLE_ID", id)
			.input("USUARIO_MODIFICACION", usuario)
			.query("UPDATE RESPONSABLE SET ESTADO = 0, USUARIO_MODIFICACION = @USUARIO_MODIFICACION, FECHA_MODIFICACION = GETDATE() WHERE RESPONSABLE_ID = @RESPONSABLE_ID");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found with the provided ID" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing DELETE:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}

// Manejo del método PUT
export async function PUT(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, descripcion, usuario } = await request.json();
		const result = await pool
			.request()
			.input("id", id)
			.input("nombre", descripcion)
			.input("USUARIO_MODIFICACION", usuario)
			.query("UPDATE RESPONSABLE SET NOMBRE = @nombre, USUARIO_MODIFICACION = @USUARIO_MODIFICACION, FECHA_MODIFICACION = GETDATE() WHERE RESPONSABLE_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found with the provided ID" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}
