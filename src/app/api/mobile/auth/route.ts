import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { poolPromise } from "@sql/lib/db"; // Tu conexión a la base de datos
import bcrypt from "bcrypt";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "lvjancarrion";

export async function POST(req: NextRequest) {
	try {
		// Parsear la solicitud
		const body = await req.json();
		const { username, password } = body || {};

		// Validar campos requeridos
		if (!username || typeof username !== "string" || username.trim() === "") {
			return NextResponse.json({ message: "Username is required and must be a non-empty string." }, { status: 400 });
		}

		if (!password || typeof password !== "string" || password.trim() === "") {
			return NextResponse.json({ message: "Password is required and must be a non-empty string." }, { status: 400 });
		}

		// Validar credenciales con la base de datos
		const pool = await poolPromise;
		const result = await pool.request().query(`SELECT u.*, A.DESCRIPCION FROM MAE_USUARIO as u
         INNER JOIN MAE_AREA A on u.AREA_ID = A.AREA_ID
         WHERE U.USUARIO = '${username}'`);

		if (result.recordset.length === 0) {
			return NextResponse.json({ message: "Invalid username" }, { status: 401 });
		}

		const user = result.recordset[0];
		const registeredHash = user.PASSWORD;

		// Verificar contraseña
		const isPasswordValid = await bcrypt.compare(password, registeredHash);
		if (!isPasswordValid) {
			return NextResponse.json({ message: "Invalid password" }, { status: 401 });
		}

		// Crear un JWT compatible con NextAuth
		const token = jwt.sign(
			{
				name: user.NOMBRE,
				email: user.CORREO,
				areaId: user.AREA_ID,
				areaName: user.DESCRIPCION,
				userId: user.ID,
			},
			NEXTAUTH_SECRET,
			{ expiresIn: "99999h" } // Configura la expiración según tus necesidades
		);

		// Responder con el token
		return NextResponse.json({ token }, { status: 200 });
	} catch (error) {
		console.error("Error in external-login endpoint:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
