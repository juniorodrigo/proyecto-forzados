import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// TAG CENTRO_______________________________________________________________

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM SUB_AREA WHERE ESTADO = 1");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.SUBAREA_ID,
				codigo: singleValue.CODIGO,
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
		const { codigo, descripcion, usuario } = await request.json();
		const result = await pool
			.request()
			.input("CODIGO", codigo)
			.input("DESCRIPCION", descripcion)
			.input("USUARIO_CREACION", usuario)
			.input("USUARIO_MODIFICACION", usuario)
			.query(
				"INSERT INTO SUB_AREA (CODIGO, DESCRIPCION, USUARIO_CREACION, USUARIO_MODIFICACION, FECHA_CREACION, FECHA_MODIFICACION, ESTADO) VALUES (@CODIGO, @DESCRIPCION, @USUARIO_CREACION, @USUARIO_MODIFICACION, GETDATE(), GETDATE(), 1)"
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
			.input("ID", id)
			.input("USUARIO_MODIFICACION", usuario)
			.query("UPDATE SUB_AREA SET ESTADO = 0, USUARIO_MODIFICACION = @USUARIO_MODIFICACION, FECHA_MODIFICACION = GETDATE() WHERE SUBAREA_ID = @ID");

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Record updated successfully" });
		} else {
			return NextResponse.json({ success: false, message: "No record found to update" }, { status: 404 });
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
		const { id, codigo, descripcion, usuario } = await request.json();
		const result = await pool
			.request()
			.input("ID", id)
			.input("CODIGO", codigo)
			.input("DESCRIPCION", descripcion)
			.input("USUARIO_MODIFICACION", usuario)
			.query("UPDATE SUB_AREA SET CODIGO = @CODIGO, DESCRIPCION = @DESCRIPCION, USUARIO_MODIFICACION = @USUARIO_MODIFICACION, FECHA_MODIFICACION = GETDATE() WHERE SUBAREA_ID = @ID");

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
