import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";
// import bcrypt from "bcrypt";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query(`
            SELECT
            P.PUESTO_ID,
            P.DESCRIPCION,
            P.ESTADO,
            (
                SELECT
                    R.ROL_ID as id,
                    R.DESCRIPCION as descripcion
                FROM
                    MAE_PUESTO_ROL PR
                JOIN
                    MAE_ROL R ON PR.ROL_ID = R.ROL_ID
                WHERE
                    PR.PUESTO_ID = P.PUESTO_ID
                FOR JSON PATH
            ) AS ROLES_JSON,
			P.NIVEL_RIESGO_APROBACION
        FROM
            MAE_PUESTO P;
        `);

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.PUESTO_ID,
				descripcion: singleValue.DESCRIPCION,
				estado: singleValue.ESTADO,
				roles: singleValue.ROLES_JSON,
				aprobadorNivel: singleValue.NIVEL_RIESGO_APROBACION,
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
		const { descripcion, estado, roles, usuarioCreacion, aprobadorNivel } = await request.json();

		// Convertir roles de objeto a array
		const rolesArray: { id: number }[] = Object.values(roles);

		console.log({ descripcion, estado, roles: rolesArray, usuarioCreacion });

		const result = await pool.request().input("descripcion", descripcion).input("estado", estado).input("usuarioCreacion", usuarioCreacion).input("aprobadorNivel", aprobadorNivel)
			.query(`INSERT INTO MAE_PUESTO (DESCRIPCION, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION, NIVEL_RIESGO_APROBACION)
                    OUTPUT INSERTED.PUESTO_ID
                    VALUES (@descripcion, @estado, @usuarioCreacion, GETDATE(), @usuarioCreacion, GETDATE(), @aprobadorNivel)`);

		if (result.rowsAffected[0] > 0) {
			const puestoId = result.recordset[0].PUESTO_ID;

			for (const rol of rolesArray) {
				await pool.request().input("puestoId", puestoId).input("rolId", rol.id).input("usuarioCreacion", usuarioCreacion)
					.query(`INSERT INTO MAE_PUESTO_ROL (PUESTO_ID, ROL_ID, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
                            VALUES (@puestoId, @rolId, @usuarioCreacion, GETDATE(), @usuarioCreacion, GETDATE())`);
			}

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
		const {
			id,
			descripcion,
			estado,
			roles,
			usuarioModificacion,
			aprobadorNivel,
		}: { id: number; descripcion: string; estado: string; roles: { id: number }[]; usuarioModificacion: string; aprobadorNivel: string } = await request.json();

		// Convertir roles de objeto a array
		const rolesArray = Object.values(roles);

		await pool.request().input("id", id).input("descripcion", descripcion).input("estado", estado).input("aprobadorNivel", aprobadorNivel).input("usuarioModificacion", usuarioModificacion).query(`
				UPDATE MAE_PUESTO
				SET DESCRIPCION = @descripcion,
					ESTADO = @estado,
					USUARIO_MODIFICACION = @usuarioModificacion,
					FECHA_MODIFICACION = GETDATE(),
					NIVEL_RIESGO_APROBACION = @aprobadorNivel
				WHERE PUESTO_ID = @id
			`);

		await pool.request().input("id", id).query(`DELETE FROM MAE_PUESTO_ROL WHERE PUESTO_ID = @id`);

		for (const rol of rolesArray) {
			await pool.request().input("puestoId", id).input("rolId", rol.id).input("usuarioModificacion", usuarioModificacion).query(`
					INSERT INTO MAE_PUESTO_ROL
						(PUESTO_ID, ROL_ID, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
					VALUES
						(@puestoId, @rolId, @usuarioModificacion, GETDATE(), @usuarioModificacion, GETDATE())
				`);
		}

		return NextResponse.json({ success: true, message: "registro actualizado" });
	} catch (error) {
		console.error("Error processing PUT:", error);
		return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 });
	}
}
