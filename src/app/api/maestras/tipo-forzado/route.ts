import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM TIPO_FORZADO WHERE ESTADO = 1");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.TIPOFORZADO_ID,
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
		const { descripcion, usuario } = await request.json();
		const result = await pool
			.request()
			.input("descripcion", descripcion)
			.input("usuario", usuario)
			.query(
				"INSERT INTO TIPO_FORZADO (DESCRIPCION, USUARIO_CREACION, USUARIO_MODIFICACION, FECHA_CREACION, FECHA_MODIFICACION, ESTADO) VALUES (@descripcion, @usuario, @usuario, GETDATE(), GETDATE(), 1)"
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
			.input("id", id)
			.input("usuario", usuario)
			.query("UPDATE TIPO_FORZADO SET ESTADO = 0, USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE TIPOFORZADO_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found with the given ID" }, { status: 404 });
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
			.input("descripcion", descripcion)
			.input("usuario", usuario)
			.query("UPDATE TIPO_FORZADO SET DESCRIPCION = @descripcion, USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE TIPOFORZADO_ID = @id");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found with the given ID" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}
