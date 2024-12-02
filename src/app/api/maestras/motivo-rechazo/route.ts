import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM MOTIVO_RECHAZO WHERE ESTADO = 1");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.MOTIVORECHAZO_ID,
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
		const { descripcion, usuarioCreacion } = await request.json();
		const fechaCreacion = new Date();
		const result = await pool
			.request()
			.input("descripcion", descripcion)
			.input("estado", 1)
			.input("usuarioCreacion", usuarioCreacion)
			.input("fechaCreacion", fechaCreacion)
			.query("INSERT INTO MOTIVO_RECHAZO (DESCRIPCION, ESTADO, USUARIO_CREACION, FECHA_CREACION) VALUES (@descripcion, @estado, @usuarioCreacion, @fechaCreacion)");

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
		const result = await pool.request().input("id", id).query("UPDATE MOTIVO_RECHAZO SET ESTADO = 0 WHERE MOTIVORECHAZO_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record deleted successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found with the given ID" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing DELETE:", error);
		return NextResponse.json({ success: false, message: "Error deleting data" }, { status: 500 });
	}
}

// Manejo del método PUT
export async function PUT(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, descripcion, usuarioModificacion } = await request.json();
		const fechaModificacion = new Date();
		const result = await pool
			.request()
			.input("id", id)
			.input("descripcion", descripcion)
			.input("usuarioModificacion", usuarioModificacion)
			.input("fechaModificacion", fechaModificacion)
			.query("UPDATE MOTIVO_RECHAZO SET DESCRIPCION = @descripcion, USUARIO_MODIFICACION = @usuarioModificacion, FECHA_MODIFICACION = @fechaModificacion WHERE MOTIVORECHAZO_ID = @id");

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
