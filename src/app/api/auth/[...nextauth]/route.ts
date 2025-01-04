import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { poolPromise } from "@sql/lib/db";
import bcrypt from "bcrypt";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { username, password } = credentials ?? {};

				const pool = await poolPromise;
				const result = await pool.request().query(`SELECT u.*, A.DESCRIPCION FROM MAE_USUARIO as u
         INNER JOIN MAE_AREA A on u.AREA_ID = A.AREA_ID
         WHERE U.USUARIO = '${username}'`);

				if (result.recordset.length === 0) {
					throw new Error("Invalid username");
				}

				const registeredHash = result.recordset[0].PASSWORD;

				if (await bcrypt.compare(password ?? "", registeredHash)) {
					return {
						id: result.recordset[0].ID,
						name: result.recordset[0].NOMBRE,
						email: result.recordset[0].CORREO,
						area: result.recordset[0].AREA,
					};
				} else {
					console.log("Password does not match");
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: "/auth/ingresar",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET || "lvjancarrion",
});

export { handler as GET, handler as POST };
