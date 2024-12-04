import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query(`SELECT UX.USUARIO_ID,
		UX.NOMBRE,
		UX.APEPATERNO,
		UX.APEMATERNO,
		UX.AREA_ID,
		AR.DESCRIPCION AS AREA_DESCRIPCION,
		UX.ROL_ID,
		ROL.DESCRIPCION,
		UX.ESTADO,
		UX.DNI,
		UX.PUESTO_ID,
		PX.DESCRIPCION,
		UX.CORREO,
		UX.USUARIO

	FROM MAE_USUARIO UX
		LEFT JOIN MAE_AREA AR ON UX.AREA_ID = AR.AREA_ID
		LEFT JOIN MAE_ROL ROL ON UX.ROL_ID = ROL.ROL_ID
		LEFT JOIN MAE_PUESTO PX ON UX.PUESTO_ID = PX.PUESTO_ID`);

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.USUARIO_ID,
				nombre: singleValue.NOMBRE,
				apePaterno: singleValue.APEPATERNO,
				apeMaterno: singleValue.APEMATERNO,
				areaId: singleValue.AREA_ID,
				areaDescripcion: singleValue.AREA_DESCRIPCION,
				rolId: singleValue.ROL_ID,
				rolDescripcion: singleValue.DESCRIPCION,
				estado: singleValue.ESTADO,
				dni: singleValue.DNI,
				puestoId: singleValue.PUESTO_ID,
				puestoDescripcion: singleValue.DESCRIPCION,
				correo: singleValue.CORREO,
				usuario: singleValue.USUARIO,
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

export async function DELETE(request: Request) {
	try {
		const pool = await poolPromise;
		const { usuarioId, usuarioModificacion } = await request.json();
		const result = await pool.request().input("usuarioId", usuarioId).input("usuarioModificacion", usuarioModificacion).query(`UPDATE MAE_USUARIO SET 
			        ESTADO = 0, 
			        USUARIO_MODIFICACION = @usuarioModificacion, 
			        FECHA_MODIFICACION = GETDATE() 
			        WHERE USUARIO_ID = @usuarioId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "user status updated to 0" });
		} else {
			return NextResponse.json({ success: false, message: "no user status updated" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing DELETE:", error);
		return NextResponse.json({ success: false, message: "Error updating user status" }, { status: 500 });
	}
}
