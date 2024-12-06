import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

// Manejo del método GET
export async function GET() {
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().query(`
			SELECT
				ESTADOSOLICITUD,
				COUNT(*) AS TOTAL_OCURRENCIAS
			FROM
				TRS_SOLICITUD_FORZADO
			GROUP BY
				ESTADOSOLICITUD
			ORDER BY
				TOTAL_OCURRENCIAS DESC;`);

		const stats = {
			aprobadasAlta: 0,
			aprobadasBaja: 0,

			pendientesAlta: 0,
			pendientesBaja: 0,

			rechazadasAlta: 0,
			rechazadasBaja: 0,

			ejecutadasAlta: 0,
			ejecutadasBaja: 0,

			finalizadas: 0,
		};

		recordset.forEach((singleValue) => {
			switch (singleValue.ESTADOSOLICITUD) {
				case "APROBADO-BAJA":
					stats.aprobadasBaja = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "APROBADO-ALTA":
					stats.aprobadasAlta = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "PENDIENTE-ALTA":
					stats.pendientesAlta = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "PENDIENTE-BAJA":
					stats.pendientesBaja = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "RECHAZADO-ALTA":
					stats.rechazadasAlta = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "RECHAZADO-BAJA":
					stats.rechazadasBaja = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "EJECUTADO-ALTA":
					stats.ejecutadasAlta = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "EJECUTADO-BAJA":
					stats.ejecutadasBaja = singleValue.TOTAL_OCURRENCIAS;
					break;
				case "FINALIZADO":
					stats.finalizadas = singleValue.TOTAL_OCURRENCIAS;
					break;
				default:
					break;
			}
		});

		return NextResponse.json({ success: true, data: stats });
	} catch (error) {
		console.error("Error processing GET:", error);
		return NextResponse.json({ success: false, message: "Error retrieving data" }, { status: 500 });
	}
}
