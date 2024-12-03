import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query("SELECT USUARIO_ID, NOMBRE,APEPATERNO, APEMATERNO FROM MAE_USUARIO");

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.USUARIO_ID,
				nombre: singleValue.NOMBRE + " " + singleValue.APEPATERNO + " " + singleValue.APEMATERNO,
			};
		});
		return NextResponse.json({ success: true, values: turnos });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { areaId, puestoId, usuario, password, dni, nombre, apePaterno, apeMaterno, correo, flagIngreso, rolId, estado, usuarioCreacion } = await request.json();
		const result = await pool
			.request()
			.input("areaId", areaId)
			.input("puestoId", puestoId)
			.input("usuario", usuario)
			.input("password", password)
			.input("dni", dni)
			.input("nombre", nombre)
			.input("apePaterno", apePaterno)
			.input("apeMaterno", apeMaterno)
			.input("correo", correo)
			.input("flagIngreso", flagIngreso)
			.input("rolId", rolId)
			.input("estado", estado)
			.input("usuarioCreacion", usuarioCreacion)
			.query(`INSERT INTO MAE_USUARIO (AREA_ID, PUESTO_ID, USUARIO, PASSWORD, DNI, NOMBRE, APEPATERNO, APEMATERNO, CORREO, FLAG_INGRESO, ROL_ID, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION) 
			        VALUES (@areaId, @puestoId, @usuario, @password, @dni, @nombre, @apePaterno, @apeMaterno, @correo, @flagIngreso, @rolId, @estado, @usuarioCreacion, GETDATE(), @usuarioCreacion, GETDATE())`);

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

export async function PUT(request: Request) {
	try {
		const pool = await poolPromise;
		const { usuarioId, areaId, puestoId, usuario, password, dni, nombre, apePaterno, apeMaterno, correo, flagIngreso, rolId, estado, usuarioModificacion } = await request.json();
		const result = await pool
			.request()
			.input("usuarioId", usuarioId)
			.input("areaId", areaId)
			.input("puestoId", puestoId)
			.input("usuario", usuario)
			.input("password", password)
			.input("dni", dni)
			.input("nombre", nombre)
			.input("apePaterno", apePaterno)
			.input("apeMaterno", apeMaterno)
			.input("correo", correo)
			.input("flagIngreso", flagIngreso)
			.input("rolId", rolId)
			.input("estado", estado)
			.input("usuarioModificacion", usuarioModificacion).query(`UPDATE MAE_USUARIO SET 
			        AREA_ID = @areaId, 
			        PUESTO_ID = @puestoId, 
			        USUARIO = @usuario, 
			        PASSWORD = @password, 
			        DNI = @dni, 
			        NOMBRE = @nombre, 
			        APEPATERNO = @apePaterno, 
			        APEMATERNO = @apeMaterno, 
			        CORREO = @correo, 
			        FLAG_INGRESO = @flagIngreso, 
			        ROL_ID = @rolId, 
			        ESTADO = @estado, 
			        USUARIO_MODIFICACION = @usuarioModificacion, 
			        FECHA_MODIFICACION = GETDATE() 
			        WHERE USUARIO_ID = @usuarioId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "values updated in database" });
		} else {
			return NextResponse.json({ success: false, message: "no values updated" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}
