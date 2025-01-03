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
            ) AS ROLES_JSON
        FROM
            MAE_PUESTO P;
        `);

		const turnos = recordset.map((singleValue) => {
			return {
				id: singleValue.PUESTO_ID,
				descripcion: singleValue.DESCRIPCION,
				estado: singleValue.ESTADO,
				roles: singleValue.ROLES_JSON,
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
		const { descripcion, estado, roles, usuarioCreacion } = await request.json();

		console.log({ descripcion, estado, roles, usuarioCreacion });

		const result = await pool.request().input("descripcion", descripcion).input("estado", estado).input("usuarioCreacion", usuarioCreacion)
			.query(`INSERT INTO MAE_PUESTO (DESCRIPCION, ESTADO, USUARIO_CREACION, FECHA_CREACION, USUARIO_MODIFICACION, FECHA_MODIFICACION)
                    OUTPUT INSERTED.PUESTO_ID
                    VALUES (@descripcion, @estado, @usuarioCreacion, GETDATE(), @usuarioCreacion, GETDATE())`);

		if (result.rowsAffected[0] > 0) {
			const puestoId = result.recordset[0].PUESTO_ID;
			const rolesArray = roles;

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
		const { id, descripcion, estado, roles, usuarioModificacion } = await request.json();

		await pool.request().input("id", id).input("descripcion", descripcion).input("estado", estado).input("usuarioModificacion", usuarioModificacion).query(`
				UPDATE MAE_PUESTO
				SET DESCRIPCION = @descripcion,
					ESTADO = @estado,
					USUARIO_MODIFICACION = @usuarioModificacion,
					FECHA_MODIFICACION = GETDATE()
				WHERE PUESTO_ID = @id
			`);

		await pool.request().input("id", id).query(`DELETE FROM MAE_PUESTO_ROL WHERE PUESTO_ID = @id`);

		for (const rol of roles) {
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
