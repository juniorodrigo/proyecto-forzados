import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function GET() {
	const pool = await poolPromise;
	const { recordset } = await pool.request().query(`SELECT * FROM MAE_PARAMETROS_GLOBALES WHERE ESTADO = 1`);

	const paramGlobales = recordset.map((singleValue) => {
		return {
			id: singleValue.ID,
			codigo: singleValue.CODIGO,
			// valor: singleValue.VALOR,
			valorBooleano: singleValue.VALOR_BOOLEANO,
		};
	});

	const paramGlobalesObj = {};
	for (const param of paramGlobales) {
		paramGlobalesObj[param.codigo] = param.valorBooleano;
	}

	return NextResponse.json({ success: true, values: paramGlobalesObj });
}
