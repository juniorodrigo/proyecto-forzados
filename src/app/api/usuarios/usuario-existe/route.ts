import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { username, userId, mail } = await request.json();

		const result = await pool.request().input("username", username).input("userId", userId).query(`SELECT * FROM MAE_USUARIO WHERE USUARIO = @username AND MAE_USUARIO.USUARIO_ID <> @userId`);
		const result2 = await pool
			.request()
			.input("mail", mail)
			.input("userId", userId)
			.query(`SELECT * FROM MAE_USUARIO WHERE CORREO COLLATE SQL_Latin1_General_CP1_CI_AS = @mail AND MAE_USUARIO.USUARIO_ID <> @userId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ exists: true, message: "El nombre de usuario ya existe" });
		} else if (result2.rowsAffected[0] > 0) {
			return NextResponse.json({ exists: true, message: "El correo ya existe" });
		} else {
			return NextResponse.json({ exists: false });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error checking data" }, { status: 500 });
	}
}
