import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import bcrypt from "bcrypt"; // Importa bcrypt para hashear el DNI

export async function PUT(request: Request) {
	try {
		const pool = await poolPromise;
		const { id, usuario } = await request.json();

		const userDni = await pool.request().input("id", id).query("SELECT DNI FROM MAE_USUARIO WHERE USUARIO_ID = @id");

		if (userDni.recordset[0].DNI === null) {
			return NextResponse.json({ success: false, message: "No se puede reiniciar la contraseña de un usuario que no tiene DNI" }, { status: 404 });
		}

		const hashedDni = await bcrypt.hash(userDni.recordset[0].DNI, 10); // Hashea el DNI

		const result = await pool
			.request()
			.input("id", id)
			.input("usuario", usuario)
			.input("password", hashedDni) // Pasa el DNI hasheado como password
			.query("UPDATE MAE_USUARIO SET FLAG_INGRESO = '1', USUARIO_MODIFICACION = @usuario, FECHA_MODIFICACION = GETDATE(), PASSWORD = @password WHERE USUARIO_ID = @id");

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
