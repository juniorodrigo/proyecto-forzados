import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
import bcrypt from "bcrypt";

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
			ROL.DESCRIPCION AS ROL_DESCRIPCION,
			UX.ESTADO,
			UX.DNI,
			UX.PUESTO_ID,
			PX.DESCRIPCION AS PUESTO_DESCRIPCION,
			UX.CORREO,
			UX.USUARIO,
			(
				SELECT STRING_AGG('"' + CAST(ROL.ROL_ID AS NVARCHAR) + '": "' + ROL.DESCRIPCION + '"', ',')
				FROM MAE_PUESTO_ROL PR
				INNER JOIN MAE_ROL ROL ON PR.ROL_ID = ROL.ROL_ID
				WHERE PR.PUESTO_ID = UX.PUESTO_ID
			) AS ROLES_JSON
		FROM MAE_USUARIO UX
		LEFT JOIN MAE_AREA AR ON UX.AREA_ID = AR.AREA_ID
		LEFT JOIN MAE_ROL ROL ON UX.ROL_ID = ROL.ROL_ID
		LEFT JOIN MAE_PUESTO PX ON UX.PUESTO_ID = PX.PUESTO_ID;
		`);

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.USUARIO_ID,
				nombre: singleValue.NOMBRE,
				apePaterno: singleValue.APEPATERNO,
				apeMaterno: singleValue.APEMATERNO,
				areaId: singleValue.AREA_ID,
				areaDescripcion: singleValue.AREA_DESCRIPCION,
				rolId: singleValue.ROL_ID,
				rolDescripcion: singleValue.ROL_DESCRIPCION,
				roles: singleValue.ROLES_JSON != undefined ? JSON.parse(`{${singleValue.ROLES_JSON}}`) : {},
				estado: singleValue.ESTADO,
				dni: singleValue.DNI,
				puestoId: singleValue.PUESTO_ID,
				puestoDescripcion: singleValue.PUESTO_DESCRIPCION,
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
		const { areaId, puestoId, usuario, dni, nombre, apePaterno, apeMaterno, correo, rolId, estado, usuarioCreacion } = await request.json();
		const newPassword = (apePaterno + dni).replace(/ /g, "").toLowerCase();
		const passwordHash = await bcrypt.hash(newPassword, 10);

		const result = await pool
			.request()
			.input("areaId", areaId)
			.input("puestoId", puestoId)
			.input("usuario", usuario)
			.input("passwordHash", passwordHash)
			.input("dni", dni)
			.input("nombre", nombre)
			.input("apePaterno", apePaterno)
			.input("apeMaterno", apeMaterno)
			.input("correo", correo)
			.input("rolId", rolId)
			.input("estado", estado)
			.input("usuarioCreacion", usuarioCreacion)
			.query(`INSERT INTO MAE_USUARIO (AREA_ID, PUESTO_ID, USUARIO, PASSWORD, DNI, NOMBRE, APEPATERNO, APEMATERNO, CORREO, FLAG_INGRESO, ROL_ID, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION) 
			        VALUES (@areaId, @puestoId, @usuario, @passwordHash, @dni, @nombre, @apePaterno, @apeMaterno, @correo, 1 , @rolId, @estado, @usuarioCreacion, GETDATE(), @usuarioCreacion, GETDATE())`);

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
		const { usuarioId, areaId, puestoId, usuario, dni, nombre, apePaterno, apeMaterno, correo, rolId, estado, usuarioModificacion } = await request.json();

		const result = await pool
			.request()
			.input("usuarioId", usuarioId)
			.input("areaId", areaId)
			.input("puestoId", puestoId)
			.input("usuario", usuario)
			.input("dni", dni)
			.input("nombre", nombre)
			.input("apePaterno", apePaterno)
			.input("apeMaterno", apeMaterno)
			.input("correo", correo)
			.input("rolId", rolId)
			.input("estado", estado)
			.input("usuarioModificacion", usuarioModificacion).query(`UPDATE MAE_USUARIO SET 
			        AREA_ID = @areaId, 
			        PUESTO_ID = @puestoId, 
			        USUARIO = @usuario, 
			        DNI = @dni, 
			        NOMBRE = @nombre, 
			        APEPATERNO = @apePaterno, 
			        APEMATERNO = @apeMaterno, 
			        CORREO = @correo, 
			        ROL_ID = @rolId, 
			        ESTADO = @estado, 
			        USUARIO_MODIFICACION = @usuarioModificacion, 
			        FECHA_MODIFICACION = GETDATE() 
			        WHERE USUARIO_ID = @usuarioId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Usuario actualizado correctamente" });
		} else {
			return NextResponse.json({ success: false, message: "Error al actualizar el usuario" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	const { usuarioId } = await request.json();

	try {
		const pool = await poolPromise;
		// const { usuarioId } = await request.json();
		const result = await pool.request().input("usuarioId", usuarioId).query(`DELETE FROM MAE_USUARIO WHERE USUARIO_ID = @usuarioId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ success: true, message: "Usuario eliminado correctamente" });
		} else {
			const result2 = await pool.request().input("usuarioId", usuarioId).query(`UPDATE MAE_USUARIO SET ESTADO = 0 WHERE USUARIO_ID = @usuarioId`);
			if (result2.rowsAffected[0] > 0) {
				return NextResponse.json({ success: true, message: "Usuario deshabilitado correctamente" });
			} else {
				return NextResponse.json({ success: false, message: "No se pudo eliminar ni deshabilitar el usuario" }, { status: 500 });
			}
		}
	} catch (error) {
		console.error("Error processing DELETE:", error);
		try {
			const pool = await poolPromise;
			// const { usuarioId } = await request.json();

			const result2 = await pool.request().input("usuarioId", usuarioId).query(`UPDATE MAE_USUARIO SET ESTADO = 0 WHERE USUARIO_ID = @usuarioId`);
			if (result2.rowsAffected[0] > 0) {
				return NextResponse.json({ success: true, message: "Usuario deshabilitado correctamente" });
			} else {
				return NextResponse.json({ success: false, message: "No se pudo deshabilitar el usuario" }, { status: 500 });
			}
		} catch (updateError) {
			console.error("Error deshabilitando usuario:", updateError);
			return NextResponse.json({ success: false, message: "Error deshabilitando el usuario" }, { status: 500 });
		}
	}
	return NextResponse.json({ success: false, message: "Error deleting user" }, { status: 500 });
}
