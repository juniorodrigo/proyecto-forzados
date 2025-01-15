import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT * FROM MAE_TAGS_MATRIZ_RIESGO WHERE ESTADO = 1");

		const rows = recordset.map((singleValue) => {
			return {
				id: singleValue.ID,
				prefijoId: singleValue.SUB_AREA_ID,
				centroId: singleValue.TAG_CENTRO_ID,
				sufijo: singleValue.SUFIJO,
				probabilidadId: singleValue.PROBABILIDAD_ID,
				impactoId: singleValue.IMPACTO_ID,
			};
		});
		return NextResponse.json({ success: true, values: rows });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}

// Manejo del método POST
export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { prefijoId, centroId, sufijo, probabilidadId, impactoId, usuario } = await request.json();
		const result = await pool
			.request()
			.input("prefijoId", prefijoId)
			.input("centroId", centroId)
			.input("sufijo", sufijo)
			.input("probabilidadId", probabilidadId)
			.input("impactoId", impactoId)
			.input("usuario", usuario)
			.query(
				"INSERT INTO MAE_TAGS_MATRIZ_RIESGO (SUB_AREA_ID, TAG_CENTRO_ID, SUFIJO, PROBABILIDAD_ID, IMPACTO_ID, USUARIO_CREACION, USUARIO_MODIFICACION, FECHA_CREACION, FECHA_MODIFICACION, ESTADO) VALUES (@prefijoId, @centroId, @sufijo, @probabilidadId, @impactoId, @usuario, @usuario, GETDATE(), GETDATE(), 1)"
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
			.query("UPDATE MAE_TAGS_MATRIZ_RIESGO SET ESTADO = 0, USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE ID = @id");

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
		const { id, prefijoId, centroId, sufijo, probabilidadId, impactoId, usuario } = await request.json();
		const result = await pool
			.request()
			.input("id", id)
			.input("prefijoId", prefijoId)
			.input("centroId", centroId)
			.input("sufijo", sufijo)
			.input("probabilidadId", probabilidadId)
			.input("impactoId", impactoId)
			.input("usuario", usuario)
			.query(
				"UPDATE MAE_TAGS_MATRIZ_RIESGO SET SUB_AREA_ID = @prefijoId, TAG_CENTRO_ID = @centroId, SUFIJO = @sufijo, PROBABILIDAD_ID = @probabilidadId, IMPACTO_ID = @impactoId, USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE() WHERE ID = @id"
			);

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
