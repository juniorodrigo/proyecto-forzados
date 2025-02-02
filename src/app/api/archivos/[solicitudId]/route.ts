import { NextRequest, NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db"; // Importar poolPromise para la conexión a la base de datos

export async function GET(req: NextRequest, { params }: { params: Promise<{ solicitudId: string }> }) {
	const { solicitudId } = await params;
	try {
		const pool = await poolPromise;
		const { recordset } = await pool.request().input("id", solicitudId).query(`SELECT * FROM MAE_DATO_ADJUNTO WHERE SOLICITUD_ID = @id;`);
		if (recordset.length === 0) {
			return NextResponse.json({ error: "No se encontraron datos adjuntos" }, { status: 404 });
		}
		const archivos = recordset.map((record: any) => ({
			id: record.DATOADJUNTO_ID,
			nombreArchivo: record.NOMBRE_ARCHIVO,
			archivo: record.ARCHIVO.toString("base64"), // Convertir el archivo a base64
			estado: record.ESTADO,
			usuarioCreacion: record.USUARIO_CREACION,
			fechaCreacion: record.FECHA_CREACION,
			usuarioModificacion: record.USUARIO_MODIFICACION,
			fechaModificacion: record.FECHA_MODIFICACION,
		}));
		return NextResponse.json(archivos, { status: 200 });
	} catch (error) {
		console.error("Error fetching archivos:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
