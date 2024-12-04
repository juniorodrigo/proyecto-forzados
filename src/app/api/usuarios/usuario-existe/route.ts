import { NextResponse } from "next/server";
import { poolPromise } from "@sql/lib/db";

export async function POST(request: Request) {
	try {
		const pool = await poolPromise;
		const { username, userId } = await request.json();

		const result = await pool.request().input("username", username).input("userId", userId).query(`SELECT * FROM MAE_USUARIO WHERE USUARIO = @username AND MAE_USUARIO.USUARIO_ID <> @userId`);

		if (result.rowsAffected[0] > 0) {
			return NextResponse.json({ exists: true });
		} else {
			return NextResponse.json({ exists: false });
		}
	} catch (error) {
		console.error("Error processing POST:", error);
		return NextResponse.json({ success: false, message: "Error checking data" }, { status: 500 });
	}
}
